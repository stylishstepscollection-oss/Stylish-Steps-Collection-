// app/api/disputes/[id]/messages/read/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Dispute from '@/models/Dispute';

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

    const dispute = await Dispute.findById(id);
    if (!dispute) {
      return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    // Check authorization
    const isAdmin = session.user.role === 'admin';
    const isOwner = dispute.user._id.toString() === session.user.id;
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Mark all messages not sent by current user as read
    dispute.messages.forEach((msg: any) => {
      if (msg.sender.toString() !== session.user.id) {
        msg.isRead = true;
      }
    });

    await dispute.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Mark messages as read error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}