import { NextResponse } from "next/server";
import { logout } from "@/lib/actions/auth";

/* ============================================================================
   LOGOUT
   DELETE /api/auth
============================================================================ */
export async function DELETE() {
  try {
    await logout();

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to logout',
      },
      { status: 500 }
    );
  }
}
