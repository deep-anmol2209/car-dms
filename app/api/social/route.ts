import { NextRequest, NextResponse } from 'next/server';
import { getRecentFacebookPosts, postVehicleToFacebook } from '@/lib/services/facebook'; // adjust path if needed





export async function GET() {
  try {
    const data = await getRecentFacebookPosts(10);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("API Error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vehicleId } = body;

    if (!vehicleId) {
      return NextResponse.json(
        { success: false, error: 'vehicleId is required' },
        { status: 400 }
      );
    }

    const result = await postVehicleToFacebook(vehicleId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      postId: result.id,
    });
  } catch (error: any) {
    console.error('Facebook Post API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Something went wrong',
      },
      { status: 500 }
    );
  }
}