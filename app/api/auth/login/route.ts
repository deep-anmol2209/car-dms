import { NextResponse } from 'next/server';
import { login, logout } from '@/lib/actions/auth';

/* ============================================================================
   LOGIN
   POST /api/auth
============================================================================ */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {data,user} = await login({
      email: body.email,
      password: body.password,
    });
console.log("data: ", data, user);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: user.data.role,
          full_name: user.data.full_name,
          phone: user.data.phone,
          avatar: user.data.avatar,
          start_date: user.data.start_date,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message ?? 'Invalid credentials',
      },
      { status: 401 }
    );
  }
}

