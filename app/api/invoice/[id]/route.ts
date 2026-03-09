import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import {
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  markInvoicePaid,
} from '@/lib/actions/invoice';

import { invoiceFormSchema, INVOICE_STATUSES, invoiceObjectSchema } from '@/types/invoice';

/* ============================================================================
   GET /api/invoices/:id
   ============================================================================ */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await getInvoiceById(params.id);

    return NextResponse.json(invoice, { status: 200 });
  } catch (error) {
    console.error('[INVOICE_GET]', error);

    return NextResponse.json(
      { message: 'Invoice not found' },
      { status: 404 }
    );
  }
}

/* ============================================================================
   PATCH /api/invoices/:id
   - Partial update (status, notes, dates, etc.)
   ============================================================================ */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    // 🔒 Only allow safe partial updates
    const PartialSchema = invoiceObjectSchema.partial();
    const parsed = PartialSchema.parse(body);

    await updateInvoice(params.id, parsed);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[INVOICE_UPDATE]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', issues: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

/* ============================================================================
   DELETE /api/invoices/:id
   ============================================================================ */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteInvoice(params.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[INVOICE_DELETE]', error);

    return NextResponse.json(
      { message: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}

/* ============================================================================
   POST /api/invoices/:id/pay
   (optional endpoint for mark-as-paid)
   ============================================================================ */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { pathname } = new URL(req.url);

  if (!pathname.endsWith('/pay')) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  try {
    await markInvoicePaid(params.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[INVOICE_PAY]', error);

    return NextResponse.json(
      { message: 'Failed to mark invoice as paid' },
      { status: 500 }
    );
  }
}
