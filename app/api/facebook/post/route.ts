import { NextRequest, NextResponse } from 'next/server';
import { postVehicleToFacebook } from '@/lib/services/facebook';

export async function POST(req: NextRequest) {
  try {
    const { vehicleId } = await req.json();

    if (!vehicleId) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      );
    }

    const result = await postVehicleToFacebook(vehicleId);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to post to Facebook' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
