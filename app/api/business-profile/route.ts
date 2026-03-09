import { NextResponse } from "next/server";
import {
  createBusinessProfile,
  getBusinessProfile,
  updateBusinessProfile,
  deleteBusinessProfile,
} from "@/lib/actions/business-profile";

/**
 * GET → Fetch business profile
 */
export async function GET() {
  try {
    const profile = await getBusinessProfile();

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch business profile" },
      { status: 500 }
    );
  }
}

/**
 * POST → Create business profile
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await createBusinessProfile(body);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create business profile" },
      { status: 500 }
    );
  }
}

/**
 * PUT → Update business profile
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const { id, ...payload } = body;

    const result = await updateBusinessProfile(id, payload);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update business profile" },
      { status: 500 }
    );
  }
}

/**
 * DELETE → Delete business profile
 */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const result = await deleteBusinessProfile(id);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete business profile" },
      { status: 500 }
    );
  }
}