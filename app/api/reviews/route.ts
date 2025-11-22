import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { productId, orderId, rating, title, comment, images } = body;

    // Verify order exists and is delivered
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.user.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (order.status !== 'delivered') {
      return NextResponse.json(
        { error: 'Can only review delivered orders' },
        { status: 400 }
      );
    }

    // Check if product is in order
    const productInOrder = order.products.some(
      (p: any) => p.product.toString() === productId
    );
    if (!productInOrder) {
      return NextResponse.json(
        { error: 'Product not in order' },
        { status: 400 }
      );
    }

    // Create review
    const review = await Review.create({
      user: session.user.id,
      product: productId,
      order: orderId,
      rating,
      title,
      comment,
      images: images || [],
    });

    return NextResponse.json({ message: 'Review submitted successfully', review });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const query = productId ? { product: productId } : {};
    const reviews = await Review.find(query)
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ reviews });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}