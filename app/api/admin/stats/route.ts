import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get statistics
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      outOfStockProducts,
      featuredProducts,
    ] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'completed' }),
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Product.countDocuments({ inStock: false }),
      Product.countDocuments({ featured: true }),
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('products.product', 'name price')
      .lean();

    // Get sales by category
    const salesByCategory = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $unwind: '$products' },
      {
        $lookup: {
          from: 'products',
          localField: 'products.product',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id: '$productInfo.category',
          total: { $sum: { $multiply: ['$products.price', '$products.quantity'] } },
          count: { $sum: '$products.quantity' },
        },
      },
    ]);

    const stats = {
      totalProducts,
      totalUsers,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      outOfStockProducts,
      featuredProducts,
      recentOrders: JSON.parse(JSON.stringify(recentOrders)),
      salesByCategory,
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}