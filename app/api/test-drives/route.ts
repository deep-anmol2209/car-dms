import { NextResponse } from 'next/server';
import {
  getTestDrives,
  createTestDrive,
} from '@/lib/actions/testDrive';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  
  const result = await getTestDrives({
    search,
    status,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ data: result.data }, { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();
try {
  const result = await createTestDrive(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ data: result.data }, { status: 201 });
} catch (error) {
  console.error("Error creating test drive:", error);
  return NextResponse.json({ error: "Failed to create test drive" }, { status: 500 });
}
}