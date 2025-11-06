import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET /api/products/featured - Get featured products
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const products = await Product.find({ featured: true, inStock: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch featured products' },
      { status: 500 }
    );
  }
}