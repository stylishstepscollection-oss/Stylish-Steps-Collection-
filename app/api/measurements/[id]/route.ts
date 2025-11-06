import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Measurement from '@/models/Measurement';

// GET /api/measurements/[id] - Get specific measurement
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Await params
    const { id } = await params;

    const measurement = await Measurement.findOne({
      _id: id,
      user: session.user.id,
    }).lean();

    if (!measurement) {
      return NextResponse.json({ error: 'Measurement not found' }, { status: 404 });
    }

    return NextResponse.json({ measurement: JSON.parse(JSON.stringify(measurement)) });
  } catch (error: any) {
    console.error('Error fetching measurement:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch measurement' },
      { status: 500 }
    );
  }
}

// DELETE /api/measurements/[id] - Delete measurement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Await params
    const { id } = await params;

    const measurement = await Measurement.findOneAndDelete({
      _id: id,
      user: session.user.id,
    });

    if (!measurement) {
      return NextResponse.json({ error: 'Measurement not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Measurement deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting measurement:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete measurement' },
      { status: 500 }
    );
  }
}