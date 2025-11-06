import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Measurement from '@/models/Measurement';
import User from '@/models/User';

// GET /api/measurements - Get user's measurements
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const measurements = await Measurement.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ measurements: JSON.parse(JSON.stringify(measurements)) });
  } catch (error: any) {
    console.error('Error fetching measurements:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch measurements' },
      { status: 500 }
    );
  }
}

// POST /api/measurements - Create new measurement
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { measurements, gender, unit, images, notes } = body;

    // Validation
    if (!measurements || !gender) {
      return NextResponse.json(
        { error: 'Measurements and gender are required' },
        { status: 400 }
      );
    }

    const measurement = await Measurement.create({
      user: session.user.id,
      measurements,
      gender,
      unit: unit || 'cm',
      images: images || [],
      notes,
    });

    // Update user's measurements in User model
    await User.findByIdAndUpdate(session.user.id, {
      measurements: measurements,
    });

    return NextResponse.json(
      {
        message: 'Measurements saved successfully',
        measurement: JSON.parse(JSON.stringify(measurement)),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saving measurements:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save measurements' },
      { status: 500 }
    );
  }
}