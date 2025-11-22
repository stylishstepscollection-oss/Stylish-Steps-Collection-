// app/api/products/[id]/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: productId } = await params;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate stats
    const stats = {
      count: reviews.length,
      average: reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0,
    };

    return NextResponse.json({
      reviews: JSON.parse(JSON.stringify(reviews)),
      stats,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: productId } = await params;
    const body = await request.json();
    const { orderId, rating, title, comment, images } = body;

    // Validate required fields
    if (!orderId || !rating || !title || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.user.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Order does not belong to you' },
        { status: 403 }
      );
    }

    // Verify order contains the product
    const productInOrder = order.products.some(
      (item: any) => item.product.toString() === productId
    );
    if (!productInOrder) {
      return NextResponse.json(
        { error: 'Product not found in order' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this product for this order
    const existingReview = await Review.findOne({
      order: orderId,
      product: productId,
      user: session.user.id,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Create review
    const review = await Review.create({
      order: orderId,
      product: productId,
      user: session.user.id,
      rating,
      title: title.trim(),
      comment: comment.trim(),
      images: images || [],
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name')
      .lean();

    return NextResponse.json({
      success: true,
      review: JSON.parse(JSON.stringify(populatedReview)),
    });
  } catch (error: any) {
    console.error('Review creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create review' },
      { status: 500 }
    );
  }
}