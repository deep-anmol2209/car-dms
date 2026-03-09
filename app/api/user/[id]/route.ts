// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { getUserById, updateUser, deleteUser } from '@/lib/actions/user';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const result = await getUserById(params.id);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: result.data });
}
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const body = await req.json();
  
      const result = await updateUser(params.id, body);
  
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }
  
      return NextResponse.json({ data: result.data });
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }
  }

  export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const result = await deleteUser(params.id);
  
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }
  
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }
  }