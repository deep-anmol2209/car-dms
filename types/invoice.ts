/**
 * Production-Ready Invoice Types
 * No `any` types - everything is properly typed
 */

import { z } from 'zod';

/* ============================================================================
   Database Types (matching your SQL schema)
   ============================================================================ */
import { dateFromJson } from '../helper/date';
export const INVOICE_STATUSES = ['Pending', 'Paid', 'Overdue', 'Cancelled'] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];
import { Vehicle } from './inventory';
import { Customer } from './customers';
export interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  customer_id: string | null;
  vehicle_id: string | null;
  package_name: string | null;
  payment_amount: number;
  tax_rate?: number;
  tax_amount: number;
  total: number;
  status: InvoiceStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// CREATE


export type InvoiceCustomer = Pick<
  Customer,
  'id' | 'name' | 'phone' | 'email'
>;
export type InvoiceVehicle = Pick<
  Vehicle,
  'id' | 'year' | 'make' | 'model' | 'vin' | 'odometer' | 'status' | 'retail_price'
>;
// export interface Customer {
//   id: string;
//   full_name: string;
//   phone: string;
//   email: string;
 
// }

// export interface Vehicle {
//   id: string;
//   year: number;
//   make: string;
//   model: string;
//   vin: string;
//   odometer: number | null;
//   status: string;
// }

export interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

/* ============================================================================
   View Models (with joins)
   ============================================================================ */

export interface InvoiceWithRelations extends Invoice {
  customer: InvoiceCustomer | null;
  vehicle: InvoiceVehicle | null;
  line_items: LineItem[];
  
}

export interface PrintInvoice extends InvoiceWithRelations {
  transactions: FinancialTransaction[];
  total_paid: number;
  remaining_amount: number;
}
/* ============================================================================
   Tax Configuration
   ============================================================================ */

export const TAX_RATES = {
  gst: 0.05,
  pst: 0.07,
  hst: 0.13,
} as const;

export type TaxMode = 'gst+pst' | 'hst';

export interface TaxCalculation {
  subtotal: number;
  gst: number;
  pst: number;
  taxAmount: number;
  grandTotal: number;
}

/* ============================================================================
   Form Schema - ALL fields are in form state (including customer/vehicle)
   ============================================================================ */

// types/invoice.ts

export const invoiceObjectSchema = z.object({
  invoice_number: z.string().min(1, 'Invoice number is required'),
  invoice_date: dateFromJson,
  due_date: dateFromJson,

  customer_id: z.string().uuid().nullable(),
  vehicle_id: z.string().uuid().nullable(),

  package_name: z.string().optional(),

  base_price: z.number().min(0),
  package_fee: z.number().min(0),
  discount: z.number().min(0),
  tax_mode: z.enum(['gst+pst', 'hst']),

  line_items: z.array(
    z.object({
      description: z.string().min(1),
      quantity: z.number().int().min(1),
      unit_price: z.number().min(0),
    })
  ),

  status: z.enum(INVOICE_STATUSES),
  notes: z.string().optional(),
});

/* ============================================================================
   Financial Transaction DB Type
   ============================================================================ */
export const PAYMENT_CATEGORIES = [
  'Down Payment',
  'Trade-in',
  'Cash',
  'Credit Card',
  'Check',
  'Other',
] as const;

export type PaymentCategory =
  (typeof PAYMENT_CATEGORIES)[number];

export const TRANSACTION_TYPES = ['Income', 'Expense'] as const;
export type TransactionType =
  (typeof TRANSACTION_TYPES)[number];
export interface FinancialTransaction {
  id: string;
  transaction_type: TransactionType;
  category: string; // 🔥 keep flexible (DB allows many)
  amount: number;
  description: string | null;
  payment_method: PaymentCategory;
  reference_id: string | null;
  vehicle_id: string | null;
  sale_deal_id: string | null;
  invoice_id: string | null;
  transaction_date: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}


/* ============================================================================
   API Payloads
   ============================================================================ */
// types/invoice.ts
// types/invoice.ts
export interface LineItemInput {
  description: string;
  quantity: number;
  unit_price: number;
}

export const invoiceFormSchema = invoiceObjectSchema
  .refine((d) => d.due_date >= d.invoice_date, {
    path: ['due_date'],
    message: 'Due date must be after invoice date',
  })
  .refine((d) => d.customer_id !== null, {
    path: ['customer_id'],
    message: 'Customer is required',
  });

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

// types/invoice.ts

export interface CreateInvoicePayload {
  invoice_number: string;
  invoice_date: Date;
  due_date: Date;

  customer_id: string;          // ✅ REQUIRED (no null)
  vehicle_id: string | null;
  package_name: string | null;

  // calculator inputs
  base_price: number;
  package_fee: number;
  discount: number;
  tax_mode: TaxMode;

  line_items: {
    description: string;
    quantity: number;
    unit_price: number;
  }[];

  status: InvoiceStatus;
  notes: string | null;
}

// types/invoice.ts

export type UpdateInvoicePayload = {
  invoice_number?: string;
  invoice_date?: Date;
  due_date?: Date;

  customer_id?: string | null;   // ✅ nullable allowed
  vehicle_id?: string | null;
  package_name?: string | null;

  base_price?: number;
  package_fee?: number;
  discount?: number;
  tax_mode?: TaxMode;

  line_items?: LineItemInput[];

  status?: InvoiceStatus;
  notes?: string | null;
};

export type CreateFinancialTransactionPayload = {
  invoice_id: string;
  category: PaymentCategory;
  amount: number;
  description: string | null;
  transaction_date: string;
};

export const paymentSchema = z.object({
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
  transaction_date: z.date(),
  reference_id: z.string().optional(),
  notes: z.string().optional(),
});

export interface InvoiceListResponse {
  data: InvoiceWithRelations[];
  total: number;
  page: number;
  limit: number;
}
export type CreatePaymentPayload = z.infer<typeof paymentSchema>;
