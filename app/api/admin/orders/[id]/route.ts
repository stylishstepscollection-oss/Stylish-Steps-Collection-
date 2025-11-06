import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { status } = body;

    if (!status || !['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const order = await Order.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    )
      .populate('user', 'name email')
      .populate('products.product', 'name price');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Order updated successfully',
      order: JSON.parse(JSON.stringify(order)),
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const order = await Order.findByIdAndDelete(params.id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete order' },
      { status: 500 }
    );
  }
}