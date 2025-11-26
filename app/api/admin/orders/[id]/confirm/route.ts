// app/api/admin/orders/[id]/confirm/route.ts
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
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { estimatedDelivery, notes } = body; // Removed contactInfo and externalOrderId
    
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    
    
    // Convert draft to confirmed order
    order.status = 'pending';
    
    if (estimatedDelivery) {
      order.estimatedDelivery = new Date(estimatedDelivery);
    }
    
    if (notes) {
      order.notes = notes.trim();
    }
    
    // Add to status history
    order.statusHistory.push({
      status: 'pending',
      timestamp: new Date(),
      note: 'Order confirmed by admin',
      updatedBy: new mongoose.Types.ObjectId(session.user.id),
    });
    
    await order.save();
    
    return NextResponse.json({
      message: 'Order confirmed successfully',
      order: JSON.parse(JSON.stringify(order)),
    });
  } catch (error: any) {
    console.error('Error confirming order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to confirm order' },
      { status: 500 }
    );
  }
}