import { NextRequest, NextResponse } from 'next/server';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required', success: false },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Verification request failed');
    }

    // Check if payment was successful
    if (data.status && data.data.status === 'success') {
      return NextResponse.json({
        success: true,
        amount: data.data.amount / 100, // Convert from kobo to GHS
        reference: data.data.reference,
        customer: data.data.customer,
        metadata: data.data.metadata,
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Payment was not successful',
      status: data.data.status,
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}