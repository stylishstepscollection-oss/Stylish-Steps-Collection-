// app/api/disputes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Dispute from '@/models/Dispute';
import Order from '@/models/Order';
import { emailService } from '@/lib/emailjs';


function isPopulatedUser(user: any): user is { _id: string; name: string; email: string } {
  return user && typeof user === 'object' && 'email' in user;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { orderId, type, description, images } = body;

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId).populate('user', 'name email');
    if (!order || order.user._id.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const dispute = await Dispute.create({
      order: orderId,
      user: session.user.id,
      type,
      description,
      images: images || [],
      messages: [
        {
          sender: session.user.id,
          message: description,
          timestamp: new Date(),
          isAdmin: false,
        },
      ],
    });

    // Populate for email
    await dispute.populate('order');
    await dispute.populate('user', 'name email');
 if (!isPopulatedUser(order.user)) {
      return NextResponse.json({ error: 'Order user data not found' }, { status: 500 });
    }

    // Send email notifications
    const adminEmail = process.env.ADMIN_EMAIL || '';
    await emailService.sendDisputeCreated(
      dispute,
      order.user.email,
      adminEmail
    );

    return NextResponse.json(
      { message: 'Dispute created successfully', dispute },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Dispute creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: any =
      session.user.role === 'admin' ? {} : { user: session.user.id };

    if (status && status !== 'all') {
      query.status = status;
    }

    const disputes = await Dispute.find(query)
      .populate('order')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ disputes: JSON.parse(JSON.stringify(disputes)) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}