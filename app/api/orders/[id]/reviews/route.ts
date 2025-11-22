// app/api/orders/[id]/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Order from '@/models/Order';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    // Get order
    const order = await Order.findById(id);
    if (!order || order.user.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Get existing reviews for this order
    const reviews = await Review.find({ order: id }).select('product');
    const reviewedProductIds = reviews.map((r) => r.product.toString());

    // Find products that can be reviewed (delivered, not yet reviewed)
    const reviewableProducts = order.products.filter(
      (p: any) => !reviewedProductIds.includes(p.product.toString())
    );

    return NextResponse.json({
      canReview: order.status === 'delivered' && reviewableProducts.length > 0,
      reviewableProducts,
      existingReviews: reviews.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}