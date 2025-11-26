// app/api/disputes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Dispute from '@/models/Dispute';
import { emailService } from '@/lib/emailjs';


function isPopulatedUser(user: any): user is { _id: string; name: string; email: string } {
  return user && typeof user === 'object' && 'email' in user;
}

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

    const dispute = await Dispute.findById(id)
      .populate('order')
      .populate('user', 'name email')
      .populate('messages.sender', 'name')
      .lean(); 
    if (!dispute) {
      return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    // Check authorization
    if (
      session.user.role !== 'admin' &&
      dispute.user._id.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ dispute: JSON.parse(JSON.stringify(dispute)) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
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
    const { status, resolution } = body;

    const dispute = await Dispute.findById(id)
      .populate('order')
      .populate('user', 'name email');

    if (!dispute) {
      return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    // Update dispute
    dispute.status = status;
    if (resolution) {
      dispute.resolution = resolution;
    }
    await dispute.save();
 if (!isPopulatedUser(dispute.user)) {
      return NextResponse.json({ error: 'Order user data not found' }, { status: 500 });
    }

    // Send email if resolved
    if (status === 'resolved' && resolution) {
      await emailService.sendDisputeResolved(
        dispute,
        dispute.user.email,
        resolution
      );
    }

    return NextResponse.json({ dispute: JSON.parse(JSON.stringify(dispute)) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}