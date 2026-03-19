import { NextResponse } from "next/server";
import { getAssignableUsers } from "@/lib/actions/user";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    console.log("get staff users");
    
    const result = await getAssignableUsers();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: result.data
    });

  } catch (error) {
    console.error("GET /api/users/assignable error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}