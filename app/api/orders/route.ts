// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { emailService } from '@/lib/emailjs';
import Product from '@/models/Product';

// Force Product model registration
const _ = Product;

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
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Ensure Product model is registered
    if (!Product) {
      throw new Error('Product model not loaded');
    }
    
    const body = await request.json();
    const { products, total, shippingInfo, notes, paymentReference, paymentStatus } = body;

    // Validate required fields
    if (!products || !products.length || !total || !shippingInfo || !paymentReference) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate shipping info
    if (!shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
      return NextResponse.json(
        { error: 'Incomplete shipping information' },
        { status: 400 }
      );
    }

    // Create order (payment already verified)
    const order = await Order.create({
      user: session.user.id,
      products,
      total,
      shippingInfo,
      notes,
      trackingNumber: `TRACK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      paymentReference,
      paymentStatus: paymentStatus || 'paid',
      paymentMethod: 'paystack',
      status: 'processing', // Start as processing since payment is confirmed
    });

    // Populate for response - use findById with populate instead
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('products.product', 'name price images')
      .lean();

    if (!populatedOrder) {
      throw new Error('Failed to retrieve created order');
    }

    // Send confirmation email to customer
    try {
      await emailService.sendOrderConfirmation(populatedOrder, session.user.email);
    } catch (emailError) {
      console.error('Failed to send customer email:', emailError);
    }

    // Notify admin
    const adminEmail = process.env.ADMIN_EMAIL || '';
    if (adminEmail) {
      try {
        const { sendEmail } = await import('@/lib/emailjs');
        await sendEmail({
          to_email: adminEmail,
          email_subject: `New Order #${order._id.toString().slice(-8)}`,
          badge_bg_color: '#d4edda',
          badge_text_color: '#155724',
          badge_text: '🛒 New Order',
          email_title: 'New Order Received',
          email_message: `A new order has been placed by ${session.user.name || 'a customer'}.`,
          email_content_html: `
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 24px;">
              <h3 style="margin: 0 0 16px; font-size: 18px; color: #212529; font-weight: 600;">Order Details</h3>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6c757d;">Order ID:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #212529; font-weight: 600; text-align: right;">#${order._id.toString().slice(-8)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6c757d;">Customer:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #212529; text-align: right;">${session.user.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6c757d;">Total:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #212529; font-weight: 600; text-align: right;">GHS ${total}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6c757d;">Payment:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #28a745; font-weight: 600; text-align: right;">✓ PAID</td>
                </tr>
              </table>
            </div>
          `,
          cta_button_text: 'View Order',
          cta_button_link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${order._id}`,
          footer_note: '',
        });
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
      }
    }

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: JSON.parse(JSON.stringify(populatedOrder)),
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