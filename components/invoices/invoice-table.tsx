"use client";

import {
  Printer,
  CreditCard,
  FileText,
  MoreHorizontal,
  Eye,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

import { InvoiceWithRelations, InvoiceStatus } from "@/types/invoice";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface InvoiceTableProps {
  data: InvoiceWithRelations[];
  onPrint: (invoice: InvoiceWithRelations) => void;
  onPay: (invoice: InvoiceWithRelations) => void;
}

const statusStyles: Record<InvoiceStatus, string> = {
  Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Overdue: "bg-red-100 text-red-700 border-red-200",
  Cancelled: "bg-slate-100 text-slate-700 border-slate-200",
};

// ─── Actions dropdown (shared between table & card) ──────────────────────────
function InvoiceActions({
  invoice,
  onPrint,
  onPay,
}: {
  invoice: InvoiceWithRelations;
  onPrint: (invoice: InvoiceWithRelations) => void;
  onPay: (invoice: InvoiceWithRelations) => void;
}) {
  const router = useRouter();
  const isPaid = invoice.status === "Paid";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => router.push(`/invoices/${invoice.id}`)}
          className="cursor-pointer"
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push(`/invoice/${invoice.id}`)}
          className="cursor-pointer"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </DropdownMenuItem>

        {!isPaid && (
          <DropdownMenuItem
            onClick={() => onPay(invoice)}
            className="cursor-pointer"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Pay
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Mobile card ──────────────────────────────────────────────────────────────
function InvoiceCard({
  invoice,
  onPrint,
  onPay,
}: {
  invoice: InvoiceWithRelations;
  onPrint: (invoice: InvoiceWithRelations) => void;
  onPay: (invoice: InvoiceWithRelations) => void;
}) {
  const router = useRouter();

  return (
    <div
      className="rounded-xl border bg-card p-4 shadow-sm flex flex-col gap-3 cursor-pointer hover:bg-muted/40 active:scale-[0.99] transition-all"
      onClick={() => router.push(`/invoices/${invoice.id}`)}
    >
      {/* Top row: invoice number + actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="font-mono font-semibold text-sm">
            {invoice.invoice_number}
          </span>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <InvoiceActions invoice={invoice} onPrint={onPrint} onPay={onPay} />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Customer */}
      <div className="flex flex-col gap-0.5">
        {invoice.customer ? (
          <>
            <span className="font-medium text-sm leading-tight">
              {invoice.customer.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {invoice.customer.phone}
            </span>
          </>
        ) : (
          <span className="italic text-muted-foreground text-sm">
            No customer
          </span>
        )}
      </div>

      {/* Bottom row: date · amount · status */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(invoice.invoice_date).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1 font-mono font-semibold text-foreground">
            <IndianRupee className="h-3.5 w-3.5" />
            {invoice.total.toLocaleString()}
          </span>
        </div>

        <Badge
          variant="outline"
          className={`text-xs font-normal ${statusStyles[invoice.status]}`}
        >
          {invoice.status}
        </Badge>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function InvoiceTable({ data, onPrint, onPay }: InvoiceTableProps) {
  const router = useRouter();

  return (
    <>
      {/* ── Desktop table (> 700 px) ── */}
      <div className="rounded-md border bg-card hidden max-[700px]:hidden min-[701px]:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-6"
                >
                  No invoices found
                </TableCell>
              </TableRow>
            )}

            {data.map((invoice) => {
              const isPaid = invoice.status === "Paid";

              return (
                <TableRow
                  key={invoice.id}
                  className="cursor-pointer hover:bg-muted/40 transition-colors"
                  onClick={() => router.push(`/invoices/${invoice.id}`)}
                >
                  {/* Invoice Number */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono font-medium">
                        {invoice.invoice_number}
                      </span>
                    </div>
                  </TableCell>

                  {/* Customer */}
                  <TableCell>
                    {invoice.customer ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {invoice.customer.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {invoice.customer.phone}
                        </span>
                      </div>
                    ) : (
                      <span className="italic text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(invoice.invoice_date).toLocaleDateString()}
                    </span>
                  </TableCell>

                  {/* Amount */}
                  <TableCell>
                    <span className="font-mono font-medium">
                      ₹{invoice.total.toLocaleString()}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-normal ${statusStyles[invoice.status]}`}
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <InvoiceActions
                      invoice={invoice}
                      onPrint={onPrint}
                      onPay={onPay}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* ── Mobile cards (≤ 700 px) ── */}
      <div className="flex flex-col gap-3 min-[701px]:hidden">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-6 text-sm">
            No invoices found
          </p>
        ) : (
          data.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              onPrint={onPrint}
              onPay={onPay}
            />
          ))
        )}
      </div>
    </>
  );
}
