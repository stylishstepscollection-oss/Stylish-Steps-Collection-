import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, email } = await request.json();

    if (!amount || !email) {
      return NextResponse.json(
        { error: 'Amount and email are required' },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `TXN-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Convert to pesewas (GHS to kobo)
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        metadata: {
          userId: session.user.id,
          userName: session.user.name,
          custom_fields: [
            {
              display_name: 'User',
              variable_name: 'user',
              value: session.user.name,
            },
          ],
        },
      }),
    });

    const data = await response.json();

    if (!data.status) {
      throw new Error(data.message || 'Payment initialization failed');
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (error: any) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}