import { NextResponse } from "next/server";
import { getLeadsReport } from "@/lib/actions/reports";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const data = await getLeadsReport();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Leads report error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch leads report",
      },
      { status: 500 }
    );
  }
}