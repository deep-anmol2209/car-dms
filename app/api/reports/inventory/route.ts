import { NextResponse } from "next/server";
import { getInventoryReport } from "@/lib/actions/reports";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const data = await getInventoryReport();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Inventory report error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch inventory report",
      },
      { status: 500 }
    );
  }
}