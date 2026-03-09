import { NextRequest, NextResponse } from "next/server";
import { addCustomer, getCustomers } from "@/lib/actions/customer";

/* -------------------------------------------------------------------------- */
/*                                   POST                                     */
/* -------------------------------------------------------------------------- */
/**
 * POST /api/customers
 * Create a new customer with duplicate detection
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await addCustomer(body);

    return NextResponse.json(
      {
        customer: result.customer,
        duplicates: result.duplicates ?? [],
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Create customer failed:", err);

    return NextResponse.json(
      { message: err.message || "Failed to create customer" },
      { status: 400 }
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                                    GET                                     */
/* -------------------------------------------------------------------------- */
/**
 * GET /api/customers
 * Fetch all customers
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || undefined;
    const customers = await getCustomers({ page, limit, search });

    return NextResponse.json(customers, { status: 200 });
  } catch (err: any) {
    console.error("Fetch customers failed:", err);

    return NextResponse.json(
      { message: err.message || "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
