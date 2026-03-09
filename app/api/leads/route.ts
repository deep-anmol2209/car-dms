import { NextResponse } from "next/server";
import {
  getLeads,
  addLead,
} from "@/lib/actions/lead";

/* -------------------------------------------------------------------------- */
/*                                    GET                                     */
/* -------------------------------------------------------------------------- */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const source = searchParams.get("source") || "";

    const leads = await getLeads({
      search,
      status,
      source,
    });

    return NextResponse.json(leads, { status: 200 });
  } catch (err: any) {
    console.log(err);
    
    return NextResponse.json(
      
      { message: err.message || "Failed to fetch leads" },
      { status: 500 }
    );
  }
}


/* -------------------------------------------------------------------------- */
/*                                    POST                                    */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lead = await addLead(body);

    return NextResponse.json(lead, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to create lead" },
      { status: 400 }
    );
  }
}
