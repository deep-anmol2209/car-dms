import { NextResponse } from "next/server";
import { getCurrentUser, getCurrentUserProfile } from "@/lib/actions/auth";
import { updateCurrentUserProfile } from "@/lib/actions/user";

/**
 * GET → Fetch business profile
 */
export async function GET() {
  try {
   const user = await getCurrentUserProfile();
 
   
  //  console.log(user);
   
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch current user" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
    try {
      const body = await req.json();
  
      const user = await updateCurrentUserProfile(body);
    console.log(user);
    
      return NextResponse.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Failed to update profile" },
        { status: 500 }
      );
    }
  }