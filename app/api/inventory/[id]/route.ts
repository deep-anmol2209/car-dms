import { NextResponse } from "next/server";
import { deleteVehicle, getVehicleById, updateVehicle } from "@/lib/actions/inventory";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
  const result = await getVehicleById(id);
    if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json({ data: result.data }, { status: 200 });


}
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const result = await updateVehicle(params.id, body);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ data: result.data }, { status: 200 });
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const result = await deleteVehicle(params.id);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: result.success }, { status: 200 });
}