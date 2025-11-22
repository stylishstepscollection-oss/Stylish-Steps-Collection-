// app/api/orders/draft/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    const body = await request.json();
    const { productId, size, color, price, contactMethod } = body;

    // Validate required fields
    if (!productId || !price || !contactMethod) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, price, or contactMethod' },
        { status: 400 }
      );
    }

    // Validate contactMethod
    const validMethods = ['whatsapp', 'snapchat', 'instagram'];
    if (!validMethods.includes(contactMethod)) {
      return NextResponse.json(
        { error: 'Invalid contact method' },
        { status: 400 }
      );
    }

    console.log('Creating draft order:', {
      userId: session.user.id,
      productId,
      price,
      contactMethod,
    });

    // Create draft order
    const draftOrder = await Order.create({
      user: session.user.id,
      products: [
        {
          product: productId,
          quantity: 1,
          size: size || undefined,
          color: color || undefined,
          price: Number(price),
        },
      ],
      total: Number(price),
      status: 'draft',
      contactMethod,
      contactInfo: '', // Empty for drafts
      draftExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    console.log('Draft order created successfully:', draftOrder._id);

    return NextResponse.json({
      message: 'Draft order created',
      orderId: draftOrder._id.toString(),
      order: JSON.parse(JSON.stringify(draftOrder)),
    });
  } catch (error: any) {
    console.error('Error creating draft order:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create draft order',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}