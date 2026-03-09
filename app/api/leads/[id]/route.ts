import { NextResponse } from "next/server";
import {
  updateLeadAction,
  deleteLeadAction,
  getLeadById
} from "@/lib/actions/lead";

/* -------------------------------------------------------------------------- */
/*                                   PATCH                                    */
/* -------------------------------------------------------------------------- */

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updatedLead = await updateLeadAction(params.id, body);

    return NextResponse.json(updatedLead, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to update lead" },
      { status: 400 }
    );
  }
}
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const lead = await getLeadById(params.id);

    return NextResponse.json(lead, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Lead not found" },
      { status: 404 }
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                                   DELETE                                   */
/* -------------------------------------------------------------------------- */

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await deleteLeadAction(params.id);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to delete lead" },
      { status: 400 }
    );
  }
}
