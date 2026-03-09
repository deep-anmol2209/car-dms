import { InvoiceStatus } from "@/types/invoice";
import { Badge } from "@/components/ui/badge";

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const map: Record<InvoiceStatus, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Paid: "bg-green-100 text-green-800",
    Overdue: "bg-red-100 text-red-800",
    Cancelled: "bg-slate-100 text-slate-800",
  };

  return <Badge className={map[status]}>{status}</Badge>;
}
