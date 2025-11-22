// app/api/disputes/[id]/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Dispute from '@/models/Dispute';
import { emailService } from '@/lib/emailjs';
import mongoose, { Types } from 'mongoose';
function isPopulatedUser(user: any): user is { _id: string; name: string; email: string } {
  return user && typeof user === 'object' && 'email' in user;
}

export async function POST(
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
    const body = await request.json();
    const { message } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const dispute = await Dispute.findById(id)
      .populate('order')
      .populate('user', 'name email');

    if (!dispute) {
      return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    // Check authorization
    const isAdmin = session.user.role === 'admin';
    const isOwner = dispute.user._id.toString() === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
 if (!isPopulatedUser(dispute.user)) {
      return NextResponse.json({ error: 'Order user data not found' }, { status: 500 });
    }
    const newMessage: { 
      sender: Types.ObjectId | string; 
      message: string;
      timestamp: Date;
      isAdmin: boolean;
    } = {
      sender: session.user.id, 
      message: message.trim(),
      timestamp: new Date(),
      isAdmin,
    };

    dispute.messages.push(newMessage as any);
    await dispute.save();

    const recipientEmail = isAdmin
      ? dispute.user.email
      : process.env.ADMIN_EMAIL || '';
    
    const senderName = session.user.name || (isAdmin ? 'Support Team' : 'Customer');

    await emailService.sendDisputeMessage(
      dispute,
      recipientEmail,
      senderName,
      message.trim()
    );

    // Populate the sender info for the response
    await dispute.populate('messages.sender', 'name');
    const lastMessage = dispute.messages[dispute.messages.length - 1];

    return NextResponse.json({
      message: JSON.parse(JSON.stringify(lastMessage)),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}