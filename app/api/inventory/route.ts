import { NextRequest, NextResponse } from 'next/server';
import {
  getVehicles,
  createVehicle,
  deleteVehicle,
} from '@/lib/actions/inventory';

/* -------------------------------------------------------------------------- */
/*                                   GET ALL                                  */
/* -------------------------------------------------------------------------- */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';
  const rawStatus = searchParams.get('status');
const status = rawStatus && rawStatus !== 'all' ? rawStatus : undefined;
const year = searchParams.get('year') || '';
const make = searchParams.get('make') || '';
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 10);
    const sort = searchParams.get('sort') || 'created_at_desc';

    const result = await getVehicles({
      search,
      status,
      page,
      limit,
      sort,
      year,
      make
    });

    return NextResponse.json(
      {
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('GET /api/inventory error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}


/* -------------------------------------------------------------------------- */
/*                                   CREATE                                   */
/* -------------------------------------------------------------------------- */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const vehicle = await createVehicle(body);

    return NextResponse.json(
      { data: vehicle },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POST /api/vehicle error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to create vehicle',
      },
      { status: 400 }
    );
  }
}


