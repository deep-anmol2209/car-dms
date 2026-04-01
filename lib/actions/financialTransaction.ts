'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { CreateFinancialTransactionPayload, FinancialTransaction } from '@/types/invoice';

/* ============================================================================
   VALIDATION SCHEMA
============================================================================ */

const paymentSchema = z.object({
  invoice_id: z.string().uuid(),
  amount: z.number().positive(),
  category: z.enum(['Sold', 'Warranty', 'Insurance']),
  payment_method: z.enum([
    'Cash',
    'UPI',
    'Card',
    'Bank Transfer',
    'Cheque',
  ]),
  transaction_date: z.coerce.date(),
  reference_id: z.string().nullable().optional(),
  notes: z.string().optional(),
});

export async function createPayment(payload: CreateFinancialTransactionPayload) {
  const supabase = await createClient();

  const validated = paymentSchema.parse(payload);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc(
    'process_invoice_payment',
    {
      p_invoice_id: validated.invoice_id,
      p_amount: validated.amount,
      p_category: validated.category,
      p_payment_method: validated.payment_method,
      p_reference_id: validated.reference_id ?? null,
      p_notes: validated.notes ?? null,
      p_transaction_date: validated.transaction_date,
      p_user_id: user?.id ?? null,
    }
  );

  if (error) {
    console.error('[PROCESS_INVOICE_PAYMENT]', error);
    throw new Error(error.message);
  }

  return data;
}
/* ============================================================================
   READ FINANCIAL TRANSACTIONS
============================================================================ */

export async function getFinancialTransactions(
  invoiceId?: string
): Promise<FinancialTransaction[]> {
  const supabase = await createClient();

  let query = supabase
    .from('financial_transactions')
    .select(`
      id,
      transaction_type,
      category,
      amount,
      description,
      transaction_date,
      created_at,
      updated_at,
      created_by,
      invoice_id,
      sale_deal_id,
      vehicle_id
    `)
    .order('transaction_date', { ascending: false });

  if (invoiceId) {
    query = query.eq('invoice_id', invoiceId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[GET_FINANCIAL_TRANSACTIONS]', error);
    throw new Error('Failed to fetch transactions');
  }

  return data as FinancialTransaction[];
}
