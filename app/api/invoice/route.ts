import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { createInvoice, getInvoices } from '@/lib/actions/invoice';
import { invoiceFormSchema } from '@/types/invoice';

/* ============================================================================
   GET /api/invoices
   ============================================================================ */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") ?? "";
    const status = searchParams.get("status") ?? "";
 const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
    const invoices = await getInvoices({
      search,
      status,
      page,
      limit,
    });

    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    console.error("[INVOICES_GET]", error);

    return NextResponse.json(
      { message: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

/* ============================================================================
   POST /api/invoices
   ============================================================================ */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ✅ Form-level validation
    const parsed = invoiceFormSchema.parse(body);

    // ✅ Enforce required customer at API boundary
    if (!parsed.customer_id) {
      return NextResponse.json(
        { message: 'Customer is required' },
        { status: 400 }
      );
    }

    // ✅ Build payload EXACTLY as CreateInvoicePayload expects
    const invoice = await createInvoice({
      invoice_number: parsed.invoice_number,
      invoice_date: parsed.invoice_date,
      due_date: parsed.due_date,

      customer_id: parsed.customer_id,
      vehicle_id: parsed.vehicle_id,
      package_name: parsed.package_name ?? null,

      // calculator inputs (NOT totals)
      base_price: parsed.base_price,
      package_fee: parsed.package_fee,
      discount: parsed.discount,
      tax_mode: parsed.tax_mode,

      line_items: parsed.line_items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),

      status: parsed.status,
      notes: parsed.notes ?? null,


      
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('[INVOICE_CREATE]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Validation error',
          issues: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
