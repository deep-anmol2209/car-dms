import { NextResponse } from 'next/server';
import {
  getTestDriveById,
  updateTestDrive,
  deleteTestDrive,
  patchTestDrive,
} from '@/lib/actions/testDrive';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const result = await getTestDriveById(params.id);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json({ data: result.data }, { status: 200 });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const result = await patchTestDrive(params.id, body);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ data: result.data }, { status: 200 });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const result = await deleteTestDrive(params.id);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const result = await updateTestDrive(params.id, body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { data: result.data },
    { status: 200 }
  );
}