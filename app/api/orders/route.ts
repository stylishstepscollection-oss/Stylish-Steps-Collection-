import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { emailService, sendEmail } from '@/lib/emailjs';

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: any = { user: session.user.id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('products.product', 'name price images')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      orders: JSON.parse(JSON.stringify(orders)),
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
// app/api/orders/route.ts (update POST method)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { products, total, contactMethod, contactInfo, notes } = body;

    if (!products || !products.length || !total || !contactMethod || !contactInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const order = await Order.create({
      user: session.user.id,
      products,
      total,
      contactMethod,
      contactInfo,
      notes,
      status: 'pending',
    });

    // Populate for email
    await order.populate('user', 'name email');
    await order.populate('products.product', 'name price');

    // Send confirmation email
    await emailService.sendOrderConfirmation(order, session.user.email);

    // Notify admin
    const adminEmail = process.env.ADMIN_EMAIL || '';
    if (adminEmail) {
      await sendEmail('template_new_order_admin', {
        to_email: adminEmail,
        order_id: order._id.slice(-8),
        customer_name: session.user.name,
        order_total: total,
        order_items: products.map((p: any) => p.product.name).join(', '),
      });
    }

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: JSON.parse(JSON.stringify(order)),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}