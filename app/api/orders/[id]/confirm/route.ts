import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { contactInfo, externalOrderId, estimatedDelivery, notes } = body;

    const order = await Order.findById(id) ;
if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }    

    // Convert draft to confirmed order
    order.estimatedDelivery = estimatedDelivery ? new Date(estimatedDelivery) : undefined;
    order.notes = notes;
    
    order.statusHistory.push({
      status: 'pending',
      timestamp: new Date(),
      note: 'Order confirmed by admin',
      updatedBy: new mongoose.Types.ObjectId(session.user.id),
    });

    await order.save();

    // TODO: Send confirmation notification to user
    // await sendOrderConfirmationEmail(order);

    return NextResponse.json({
      message: 'Order confirmed successfully',
      order: JSON.parse(JSON.stringify(order)),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}