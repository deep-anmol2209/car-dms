"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { 
  Printer, 
  CreditCard, 
  FileText, 
  AlertCircle, 
  Plus,
  Search
} from 'lucide-react';
import { InvoiceTable } from './invoice-table';
import { InvoiceWithRelations, InvoiceStatus, CreateFinancialTransactionPayload } from '@/types/invoice';
import { useInvoices } from '@/hooks/use-invoices';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';

import { PrintableInvoice } from '@/components/invoices/printable-invoice';
import { AddPaymentModal } from '@/components/invoices/payment-modal';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';

/* ============================================================================
   CONFIG
   ============================================================================ */

const statusStyles: Record<InvoiceStatus, string> = {
  Paid: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 border-emerald-200",
  Pending: "bg-amber-100 text-amber-700 hover:bg-amber-100/80 border-amber-200",
  Overdue: "bg-red-100 text-red-700 hover:bg-red-100/80 border-red-200",
  Cancelled: "bg-slate-100 text-slate-700 hover:bg-slate-100/80 border-slate-200",
};

/* ============================================================================
   PAGE COMPONENT
   ============================================================================ */

export default function InvoicesPage() {
  const router = useRouter();


  const [printingInvoice, setPrintingInvoice] = useState<InvoiceWithRelations | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<InvoiceWithRelations | null>(null);
  const [search, setSearch] = useState('');
const [page, setPage] = useState(1);
const limit= 10;
  const debouncedSearch = useDebounce(search, 400);
console.log("SEARCH VALUE:", debouncedSearch);

const {
  data,
  isFetching,
  isLoading,
  error,
} = useInvoices({ search: debouncedSearch, page, limit });

const invoicesData = data?.data ?? [];
const total = data?.total ?? 0;
const totalPages = Math.ceil(total / limit);




  /* ================= PRINT LOGIC ================= */
useEffect(() => {
  if (!printingInvoice) return;

  const printRoot = document.getElementById("print-root");
  if (!printRoot) return;

  printRoot.classList.remove("hidden");

  requestAnimationFrame(() => {
    window.print();
  });

  const cleanup = () => {
    printRoot.classList.add("hidden");
    setPrintingInvoice(null);
  };

  window.addEventListener("afterprint", cleanup);

  return () => {
    window.removeEventListener("afterprint", cleanup);
  };
}, [printingInvoice]);

  /* ================= PAYMENT SUBMIT ================= */
  const handleAddPayment = (data: CreateFinancialTransactionPayload) => {
    if (!paymentInvoice) return;
    console.log('PAYMENT SUBMITTED', {
      invoiceId: paymentInvoice.id,
      invoiceNumber: paymentInvoice.invoice_number,
      ...data,
    });
    setPaymentInvoice(null);
  };

  /* ================= COLUMNS DEFINITION ================= */
  // const columns: ColumnDef<InvoiceWithRelations>[] = [
  //   {
  //     accessorKey: 'invoice_number',
  //     header: 'Invoice #',
  //     cell: ({ row }) => (
  //       <div className="flex items-center gap-2">
  //           <FileText className="h-4 w-4 text-muted-foreground" />
  //           <span className="font-mono font-medium text-foreground">
  //           {row.original.invoice_number}
  //           </span>
  //       </div>
  //     ),
  //   },
  //   {
  //     header: 'Customer',
  //     cell: ({ row }) =>
  //       row.original.customer ? (
  //         <div className="flex flex-col">
  //           <span className="font-medium text-sm text-foreground">
  //             {row.original.customer.name}
  //           </span>
  //           <span className="text-xs text-muted-foreground">
  //             {row.original.customer.phone}
  //           </span>
  //         </div>
  //       ) : (
  //         <span className="text-muted-foreground italic">—</span>
  //       ),
  //   },
  //   {
  //     header: 'Date',
  //     cell: ({ row }) => (
  //         <span className="text-sm text-muted-foreground">
  //           {new Date(row.original.invoice_date).toLocaleDateString()}
  //         </span>
  //     ),
  //   },
  //   {
  //     header: 'Amount',
  //     cell: ({ row }) => (
  //       <span className="font-mono font-medium text-foreground">
  //         ₹{row.original.total.toLocaleString()}
  //       </span>
  //     ),
  //   },
  //   {
  //     header: 'Status',
  //     cell: ({ row }) => (
  //       <Badge 
  //           variant="outline" 
  //           className={`font-normal ${statusStyles[row.original.status]}`}
  //       >
  //         {row.original.status}
  //       </Badge>
  //     ),
  //   },
  //   {
  //     id: 'actions',
  //     header: () => <div className="text-right">Actions</div>,
  //     cell: ({ row }) => {
  //       const invoice = row.original;
  //       const isPaid = invoice.status === 'Paid';

  //       return (
  //         <div className="flex gap-2 justify-end">
  //           <Button
  //             size="icon"
  //             variant="ghost"
  //             className="h-8 w-8 text-muted-foreground hover:text-foreground"
  //             onClick={() => setPrintingInvoice(invoice)}
  //             title="Print Invoice"
  //           >
  //             <Printer className="h-4 w-4" />
  //           </Button>

  //           {!isPaid && (
  //             <Button
  //               size="sm"
  //               variant="outline"
  //               className="h-8 px-2 text-xs"
  //               onClick={() => setPaymentInvoice(invoice)}
  //             >
  //               <CreditCard className="h-3 w-3 mr-1.5" />
  //               Pay
  //             </Button>
  //           )}
  //         </div>
  //       );
  //     },
  //   },
  // ];

  /* ================= LOADING STATE ================= */
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
         <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading invoices...</p>
         </div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex h-[50vh] items-center justify-center text-red-500">
            <AlertCircle className="mr-2 h-5 w-5" />
            Failed to load invoices
        </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="flex-1 space-y-8 p-8 animate-in fade-in duration-500">
      
      {/* --- Header --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Invoices</h1>
          <p className="text-muted-foreground">
            Manage billing, track payments, and generate receipts.
          </p>
        </div>
        
        <Button 
            onClick={() => router.push('/invoices/new')} 
            size="lg" 
            className="shadow-sm"
        >
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
        </Button>
      </div>

      <Separator />

      {/* --- Main Table Card --- */}
      <Card className="shadow-sm border-border/60">
        <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>
                A list of all invoices issued to customers.
            </CardDescription>
        </CardHeader>
   <CardContent className="space-y-6">

  {/* 🔎 Search Bar */}
  <div className="relative w-full md:w-80">
    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Search invoice #, customer..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="pl-9"
    />
  </div>

  {/* Optional subtle updating indicator */}
  {isFetching && !isLoading && (
    <div className="text-xs text-muted-foreground">
      Updating results...
    </div>
  )}

  {/* Table */}
<InvoiceTable
  data={invoicesData}
  onPrint={(invoice) => setPrintingInvoice(invoice)}
  onPay={(invoice) => setPaymentInvoice(invoice)}
/>

{/* Pagination */}
<div className="flex items-center justify-between pt-4">
  <p className="text-sm text-muted-foreground">
    Page {page} of {totalPages}
  </p>

  <div className="flex gap-2">
    <Button
      variant="outline"
      size="sm"
      disabled={page <= 1}
      onClick={() => setPage((p) => p - 1)}
    >
      Previous
    </Button>

    <Button
      variant="outline"
      size="sm"
      disabled={page >= totalPages}
      onClick={() => setPage((p) => p + 1)}
    >
      Next
    </Button>
  </div>
</div>


</CardContent>
      </Card>

      {/* --- HIDDEN PRINT COMPONENT --- */}
      {/* <div className="hidden print:block">
        {printingInvoice && (
          <PrintableInvoice
           
            invoiceNumber={printingInvoice.invoice_number}
            invoiceDate={new Date(printingInvoice.invoice_date)}
            dueDate={new Date(printingInvoice.due_date)}
            customerName={printingInvoice.customer?.name ?? ''}
            customerPhone={printingInvoice.customer?.phone ?? null}
            customerEmail={printingInvoice.customer?.email ?? null}
            vehicleInfo={printingInvoice.vehicle ?? undefined}
            calculation={{
              subtotal: printingInvoice.payment_amount,
              gst: 0,
              pst: 0,
              taxAmount: printingInvoice.tax_amount,
              grandTotal: printingInvoice.total,
            }}
            lineItems={printingInvoice.line_items ?? []}
          />
        )}
      </div> */}

      {/* --- MODALS --- */}
      <AddPaymentModal
        open={!!paymentInvoice}
        onClose={() => setPaymentInvoice(null)}
        invoiceId={paymentInvoice?.id ?? ''}
        invoiceNumber={paymentInvoice?.invoice_number ?? ''}
        outstandingAmount={paymentInvoice?.total ?? 0}
        onSubmit={handleAddPayment}
      />
    </div>
  );
}