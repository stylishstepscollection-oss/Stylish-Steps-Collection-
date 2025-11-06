import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import {useSession} from 'next-auth/react';

export async function POST(request: NextRequest) {
  try {
    const {status} = useSession()
;

    if (status === "unauthenticated") {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { method, productInfo } = body;

    // In production, you would:
    // 1. Create a notification
    // 2. Send to messaging service
    // 3. Log the contact attempt

    return NextResponse.json({
      message: 'Contact request sent successfully',
      method,
      productInfo,
    });
  } catch (error: any) {
    console.error('Error processing contact request:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process contact request' },
      { status: 500 }
    );
  }
}