import { NextRequest, NextResponse } from 'next/server';
import { getUsers, createUser } from '@/lib/actions/user';
import { userFormSchema } from '@/types/user';
import z from 'zod';

export async function GET(request: NextRequest) {
  try {
      const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || undefined;
    const result = await getUsers({page,limit,search});

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('GET /api/user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = userFormSchema.parse(body);
    
    // Use server action to create user
    const result = await createUser(validatedData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error?.includes('already exists') ? 400 : 500 }
      );
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    console.error('POST /api/user error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}