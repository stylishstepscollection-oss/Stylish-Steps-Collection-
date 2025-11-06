import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    const query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('products.product', 'name price images')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      orders: JSON.parse(JSON.stringify(orders)),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}