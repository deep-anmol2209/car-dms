import { z } from 'zod';

export const TAX_RATES = {
  gst: 0.05, // 5% GST
  pst: 0.07, // 7% PST
  hst: 0.13, // 13% HST (combined)
};

export const invoiceSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  invoice_date: z.date(),
  due_date: z.date(),
  customer_id: z.string().uuid("Invalid customer ID"),
  vehicle_id: z.string().uuid("Invalid vehicle ID").optional(),
  package_name: z.string().optional(),
  payment_amount: z.number().min(0, "Amount must be positive"),
  tax_rate: z.number().min(0).max(100, "Tax rate must be between 0 and 100"),
  tax_amount: z.number().min(0),
  total: z.number().min(0),
  status: z.enum(['Pending', 'Paid', 'Overdue', 'Cancelled']).default('Pending'),
  notes: z.string().optional(),
  line_items: z.array(z.object({
    description: z.string(),
    quantity: z.number().min(1),
    unit_price: z.number().min(0),
    amount: z.number().min(0),
  })).optional(),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

export interface InvoiceCalculation {
  subtotal: number;
  gst: number;
  pst: number;
  taxAmount: number;
  grandTotal: number;
}
