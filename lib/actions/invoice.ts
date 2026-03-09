'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  Invoice,
  InvoiceWithRelations,
  CreateInvoicePayload,
  INVOICE_STATUSES,
  TAX_RATES,
  TaxMode,
  LineItem,
  LineItemInput,
  UpdateInvoicePayload,
} from '@/types/invoice';
import { getOrCreateSalesDeal } from '@/helper/sales-deal';

/* ============================================================================
   Helpers
   ============================================================================ */

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function calculateInvoiceTotals(
  basePrice: number,
  packageFee: number,
  discount: number,
  taxMode: TaxMode,
  lineItems: LineItemInput[]
) {
  const lineItemsTotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  const subtotal = Math.max(
    basePrice + packageFee + lineItemsTotal - discount,
    0
  );

  let taxAmount = 0;

  if (taxMode === 'gst+pst') {
    taxAmount = subtotal * (TAX_RATES.gst + TAX_RATES.pst);
  } else {
    taxAmount = subtotal * TAX_RATES.hst;
  }

  return {
    payment_amount: round(subtotal),
    tax_amount: round(taxAmount),
    total: round(subtotal + taxAmount),
  };
}

const InvoiceStatusSchema = z.enum(INVOICE_STATUSES);

/* ============================================================================
   CREATE
   ============================================================================ */

export async function createInvoice(payload: CreateInvoicePayload) {
  const supabase = await createClient();

    // 🔹 STEP 1: Ensure sales deal exists
  const newDeal= await getOrCreateSalesDeal(
    supabase,
    payload.customer_id,
    payload.vehicle_id ?? null,
    payload.base_price

  );
console.log("newDeal: ",newDeal);

  const totals = calculateInvoiceTotals(
    payload.base_price,
    payload.package_fee,
    payload.discount,
    payload.tax_mode,
    payload.line_items
  );

  const taxRate =
    totals.payment_amount > 0
      ? round((totals.tax_amount / totals.payment_amount) * 100)
      : 0;

  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({
      invoice_number: payload.invoice_number,
      invoice_date: payload.invoice_date.toISOString(),
      due_date: payload.due_date.toISOString(),
      customer_id: payload.customer_id,
      package_name: payload.package_name,

      payment_amount: totals.payment_amount,
      tax_rate: taxRate,
      tax_amount: totals.tax_amount,
      total: totals.total,
      sale_deal_id: newDeal,
      status: payload.status,
      notes: payload.notes,
    })
    .select()
    .single();

  if (error) {
    console.error('[CREATE_INVOICE]', error);
    throw new Error('Failed to create invoice');
  }

  if (payload.line_items.length) {
    const { error: itemsError } = await supabase
      .from('invoice_line_items')
      .insert(
        payload.line_items.map((item) => ({
          invoice_id: invoice.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
        amount: round(item.quantity * item.unit_price),
        }))
      );

    if (itemsError) {
      console.error('[CREATE_LINE_ITEMS]', itemsError);
      throw new Error('Invoice created but line items failed');
    }
  }

  return invoice as Invoice;
}

/* ============================================================================
   READ (LIST)
   ============================================================================ */

export async function getInvoices(filters?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const supabase = await createClient();

  const search = filters?.search?.trim() ?? "";
  const status = filters?.status ?? "";
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 10;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  /* =======================
     BASE QUERY (VIEW)
  ======================= */

  let query = supabase
    .from("invoices_search")
    .select("*", { count: "exact" }) // 🔥 IMPORTANT
    .order("created_at", { ascending: false })
    .range(from, to);

  /* =======================
     SEARCH
  ======================= */

  if (search.length >= 2) {
    const safe = search.replace(/[%_]/g, "\\$&");

    query = query.or(
      `invoice_number.ilike.%${safe}%,customer_name.ilike.%${safe}%,package_name.ilike.%${safe}%,notes.ilike.%${safe}%`
    );
  }

  /* =======================
     STATUS
  ======================= */

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("[GET_INVOICES]", error);
    throw new Error("Failed to fetch invoices");
  }

  if (!data || data.length === 0) {
    return {
      data: [],
      total: count ?? 0,
      page,
      limit,
    };
  }

  /* =======================
     COLLECT IDS
  ======================= */

  const invoiceIds = data.map(i => i.id);
  const vehicleIds = data
    .map(i => i.vehicle_id)
    .filter((id): id is string => !!id);

  /* =======================
     FETCH LINE ITEMS
  ======================= */

  const { data: lineItems } = await supabase
    .from("invoice_line_items")
    .select("invoice_id, description, quantity, unit_price, amount")
    .in("invoice_id", invoiceIds);

  /* =======================
     FETCH VEHICLES
  ======================= */

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("id, year, make, model, vin, odometer, status, retail_price")
    .in("id", vehicleIds);

  /* =======================
     MAP RESULT
  ======================= */

  const result: InvoiceWithRelations[] = data.map((row) => {
    const vehicle = vehicles?.find(v => v.id === row.vehicle_id) ?? null;

    return {
      id: row.id,
      invoice_number: row.invoice_number,
      invoice_date: row.invoice_date,
      due_date: row.due_date,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      package_name: row.package_name,
      payment_amount: row.payment_amount,
      tax_rate: row.tax_rate,
      tax_amount: row.tax_amount,
      total: row.total,
      status: row.status,
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at,

      customer: row.customer_id
        ? {
            id: row.customer_id,
            name: row.customer_name,
            phone: row.customer_phone,
            email: row.customer_email,
          }
        : null,

      vehicle: vehicle
        ? {
            id: vehicle.id,
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
            vin: vehicle.vin,
            odometer: vehicle.odometer,
            status: vehicle.status,
            retail_price: vehicle.retail_price,
          }
        : null,

      line_items: (lineItems ?? [])
        .filter(li => li.invoice_id === row.id)
        .map(li => ({
          description: li.description,
          quantity: li.quantity,
          unit_price: li.unit_price,
          amount: li.amount,
        })),
    };
  });

  return {
    data: result,
    total: count ?? 0,
    page,
    limit,
  };
}




/* ============================================================================
   UPDATE
   ============================================================================ */

// lib/actions/invoice.ts

export async function updateInvoice(
  id: string,
  payload: UpdateInvoicePayload
) {
  const supabase = await createClient();

  const updateData: Partial<Invoice> = {};

  if (payload.invoice_date)
    updateData.invoice_date = payload.invoice_date.toISOString();

  if (payload.due_date)
    updateData.due_date = payload.due_date.toISOString();

  if (payload.customer_id !== undefined)
    updateData.customer_id = payload.customer_id;


  if (payload.package_name !== undefined)
    updateData.package_name = payload.package_name;

  if (payload.status) {
    InvoiceStatusSchema.parse(payload.status);
    updateData.status = payload.status;
  }

  if (payload.notes !== undefined)
    updateData.notes = payload.notes;

  // Recalculate totals ONLY if calculator inputs exist
  if (
    payload.base_price !== undefined &&
    payload.package_fee !== undefined &&
    payload.discount !== undefined &&
    payload.tax_mode &&
    payload.line_items
  ) {
    const totals = calculateInvoiceTotals(
      payload.base_price,
      payload.package_fee,
      payload.discount,
      payload.tax_mode,
      payload.line_items
    );

    updateData.payment_amount = totals.payment_amount;
    updateData.tax_amount = totals.tax_amount;
    updateData.total = totals.total;
    updateData.tax_rate =
      totals.payment_amount > 0
        ? round((totals.tax_amount / totals.payment_amount) * 100)
        : 0;
  }

  const { error } = await supabase
    .from('invoices')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('[UPDATE_INVOICE]', error);
    throw new Error('Failed to update invoice');
  }

  return true;
}


/* ============================================================================
   DELETE
   ============================================================================ */

export async function deleteInvoice(id: string) {
  const supabase = await createClient();

  await supabase
    .from('invoice_line_items')
    .delete()
    .eq('invoice_id', id);

  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[DELETE_INVOICE]', error);
    throw new Error('Failed to delete invoice');
  }

  return true;
}

/* ============================================================================
   MARK AS PAID
   ============================================================================ */

export async function markInvoicePaid(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('invoices')
    .update({
      status: 'Paid',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .neq('status', 'Paid');

  if (error) {
    console.error('[MARK_INVOICE_PAID]', error);
    throw new Error('Failed to mark invoice as paid');
  }

  return true;
}

/* ============================================================================
   READ (BY ID)
   ============================================================================ */

// export async function getInvoiceById(
//   id: string
// ): Promise<InvoiceWithRelations> {
//   const supabase = await createClient();

//   const { data, error } = await supabase
//     .from('invoices')
//     .select(`
//       *,
//       customer:customers(
//         id,
//         name,
//         phone,
//         email
//       ),
//       line_items:invoice_line_items(
//         description,
//         quantity,
//         unit_price,
//         amount
//       ),
//       transactions:financial_transactions(
//         id,
//         transaction_type,
//         category,
//         amount,
//         payment_method,
//         reference_id,
//         notes,
//         transaction_date,
//         created_by,
//         created_at
//       )
//     `)
//     .eq('id', id)
//     .order('transaction_date', {
//       foreignTable: 'transactions',
//       ascending: false,
//     })
//     .maybeSingle();

//   if (error || !data) {
//     console.error('[GET_INVOICE_BY_ID]', error);
//     throw new Error('Invoice not found');
//   }
//  const totalPaid = data.transactions.reduce((acc:number, transaction:any) => acc + transaction.amount, 0);
//  const remainingAmount = data.total - totalPaid;
//   return data as InvoiceWithRelations;
// }

export async function getInvoiceById(
  id: string
): Promise<InvoiceWithRelations & {
  total_paid: number;
  remaining_amount: number;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      customer:customers(
        id,
        name,
        phone,
        email
      ),
      line_items:invoice_line_items(
        description,
        quantity,
        unit_price,
        amount
      ),
      transactions:financial_transactions(
        id,
        transaction_type,
        category,
        amount,
        payment_method,
        reference_id,
        notes,
        transaction_date,
        created_by,
        created_at
      )
    `)
    .eq('id', id)
    .order('transaction_date', {
      foreignTable: 'transactions',
      ascending: false,
    })
    .maybeSingle();

  if (error || !data) {
    console.error('[GET_INVOICE_BY_ID]', error);
    throw new Error('Invoice not found');
  }

  const transactions = data.transactions ?? [];

  const totalPaid = transactions
    .filter((t:any) => t.transaction_type === 'Income')
    .reduce((acc:number, t:any) => acc + Number(t.amount), 0);

  const remainingAmount = Math.max(Number(data.total) - totalPaid, 0);

  return {
    ...data,
    total_paid: Number(totalPaid.toFixed(2)),
    remaining_amount: Number(remainingAmount.toFixed(2)),
  };
}
