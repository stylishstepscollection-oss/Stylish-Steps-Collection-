import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const wishlist = await Wishlist.findOne({ user: session.user.id })
      .populate('products')
      .lean();

    if (!wishlist) {
      return NextResponse.json({ products: [] });
    }

    return NextResponse.json({
      products: JSON.parse(JSON.stringify(wishlist.products)),
    });
  } catch (error: any) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Add product to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    let wishlist = await Wishlist.findOne({ user: session.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: session.user.id,
        products: [productId],
      });
    } else {
      if (wishlist.products.includes(productId)) {
        return NextResponse.json(
          { error: 'Product already in wishlist' },
          { status: 400 }
        );
      }

      wishlist.products.push(productId);
      await wishlist.save();
    }

    return NextResponse.json({
      message: 'Product added to wishlist',
      wishlist: JSON.parse(JSON.stringify(wishlist)),
    });
  } catch (error: any) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist - Remove product from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const wishlist = await Wishlist.findOne({ user: session.user.id });

    if (!wishlist) {
      return NextResponse.json({ error: 'Wishlist not found' }, { status: 404 });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );
    await wishlist.save();

    return NextResponse.json({ message: 'Product removed from wishlist' });
  } catch (error: any) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}