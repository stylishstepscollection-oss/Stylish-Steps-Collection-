import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Measurement from '@/models/Measurement';

// GET /api/measurements/latest - Get user's latest measurement
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const measurement = await Measurement.findOne({ user: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    if (!measurement) {
      return NextResponse.json({ measurement: null });
    }

    return NextResponse.json({ measurement: JSON.parse(JSON.stringify(measurement)) });
  } catch (error: any) {
    console.error('Error fetching latest measurement:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch measurement' },
      { status: 500 }
    );
  }
}