import { NextResponse } from "next/server";
import { getSalesReport } from "@/lib/actions/reports";

export async function GET() {
  try {
    const data = await getSalesReport();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Sales report error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch sales report",
      },
      { status: 500 }
    );
  }
}