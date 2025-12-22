// app/api/ads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ad from '@/models/Ads';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get('placement');
    const adType = searchParams.get('adType');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const query: any = {};
    
    if (activeOnly) {
      query.isActive = true;
      
      // Check date ranges
      const now = new Date();
      query.$or = [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ];
      query.$and = [
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: { $gte: now } }
          ]
        }
      ];
    }

    if (placement && placement !== 'all') {
      query.$or = [
        { placement },
        { placement: 'all' }
      ];
    }

    if (adType) {
      query.adType = adType;
    }

    const ads = await Ad.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ ads });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const ad = await Ad.create(body);

    return NextResponse.json({ ad }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}