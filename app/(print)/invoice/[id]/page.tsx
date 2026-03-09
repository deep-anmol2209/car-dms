"use client";

import { useEffect } from "react";
import { PrintableInvoice } from "@/components/invoices/printable-invoice";
import { useInvoice } from "@/hooks/use-invoices";

export default function InvoicePrintPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: invoice, isLoading } = useInvoice(params.id);

useEffect(() => {
  if (!invoice) return;

  setTimeout(() => {
    window.print();
  }, 300);
}, [invoice]);


  if (isLoading || !invoice) {
    return <div className="p-10 text-center">Loading...</div>;
  }
console.log(invoice);

  return (
    <PrintableInvoice
      invoiceNumber={invoice.invoice_number}
      invoiceDate={new Date(invoice.invoice_date)}
      dueDate={new Date(invoice.due_date)}
      customerName={invoice.customer?.name ?? ""}
      customerPhone={invoice.customer?.phone ?? null}
      customerEmail={invoice.customer?.email ?? null}
      transactions={invoice.transactions}
      totalPaid={invoice.total_paid}
      remainingAmount={invoice.remaining_amount}
      vehicleInfo={invoice.vehicle ?? undefined}
      calculation={{
        subtotal: invoice.payment_amount,
        gst: 0,
        pst: 0,
        taxAmount: invoice.tax_amount,
        grandTotal: invoice.total,
      }}
      lineItems={invoice.line_items ?? []}
    />
  );
}
