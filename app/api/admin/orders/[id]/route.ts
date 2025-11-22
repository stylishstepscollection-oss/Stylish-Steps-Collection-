// app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { emailService } from '@/lib/emailjs';

// Type guard to check if user is populated
function isPopulatedUser(user: any): user is { _id: string; name: string; email: string } {
  return user && typeof user === 'object' && 'email' in user;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { status, trackingNumber, estimatedDelivery, statusNote } = body;

    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate('products.product', 'name price images');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if user is populated
    if (!isPopulatedUser(order.user)) {
      return NextResponse.json({ error: 'Order user data not found' }, { status: 500 });
    }

    // Update order fields
    if (status && status !== order.status) {
      order.status = status;
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: statusNote,
      });

      // Send email notification for status change
      await emailService.sendOrderStatusUpdate(
        order,
        order.user.email, // TypeScript now knows this exists
        status,
        statusNote
      );
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (estimatedDelivery) {
      order.estimatedDelivery = new Date(estimatedDelivery);
    }

    await order.save();

    // Send review reminder if delivered
    if (status === 'delivered') {
      // Note: setTimeout is not reliable in serverless environments
      // Consider using a job queue like Bull or a cron job instead
      setTimeout(async () => {
        if (isPopulatedUser(order.user)) {
          await emailService.sendReviewReminder(order, order.user.email);
        }
      }, 3 * 24 * 60 * 60 * 1000); // 3 days
    }

    return NextResponse.json({
      message: 'Order updated successfully',
      order: JSON.parse(JSON.stringify(order)),
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}