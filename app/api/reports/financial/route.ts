import { NextResponse } from "next/server";
import { getFinancialReport } from "@/lib/actions/reports";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const data = await getFinancialReport();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Financial report error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch financial report",
      },
      { status: 500 }
    );
  }
}