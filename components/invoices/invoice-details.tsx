// "use client";

// import React from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   ArrowLeft,
//   Printer,
//   CreditCard,
//   Download,
//   User,
//   Mail,
//   Phone,
//   Calendar,
//   Clock,
//   Hash,
//   FileText,
//   CheckCircle2,
//   AlertCircle,
//   XCircle,
//   HelpCircle,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardFooter,
// } from "@/components/ui/card";
// import { useInvoice } from "@/hooks/use-invoices";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { InvoiceStatus } from "@/types/invoice";
// import { Invoice } from "@/types/invoice";
// // --- Helpers ---

// const formatCurrency = (amount: number) => {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//   }).format(amount);
// };

// const formatDate = (dateString: string) => {
//   return new Date(dateString).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// };

// const getStatusStyles = (status: InvoiceStatus) => {
//   switch (status) {
//     case "Paid":
//       return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200";
//     case "Pending":
//       return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200";
//     case "Overdue":
//       return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
//     case "Cancelled":
//       return "bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200";
//     default:
//       return "bg-slate-100 text-slate-700 border-slate-200";
//   }
// };

// const getStatusIcon = (status: InvoiceStatus) => {
//   switch (status) {
//     case "Paid":
//       return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
//     case "Pending":
//       return <Clock className="w-3.5 h-3.5 mr-1" />;
//     case "Overdue":
//       return <AlertCircle className="w-3.5 h-3.5 mr-1" />;
//     case "Cancelled":
//       return <XCircle className="w-3.5 h-3.5 mr-1" />;
//     default:
//       return <HelpCircle className="w-3.5 h-3.5 mr-1" />;
//   }
// };

// // --- Page Component ---

// export default function InvoiceDetailsPage() {
//        const params = useParams();
//       const id = params.id as string;
//   const router = useRouter();
//   // In a real app, fetch data based on params.id
//   const {data:invoice, isLoading, error} = useInvoice(id);

// if (isLoading) return <div>Loading...</div>;
// if (error) return <div>Error: {error.message}</div>;
// if (!invoice) return null; // ✅ ADD THIS


//   return (
//     <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
//       <div className="max-w-7xl mx-auto space-y-8">
        
//         {/* 1️⃣ Header Section */}
//         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <div className="flex flex-col gap-2">
//             <button
//               onClick={() => router.back()}
//               className="group flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
//             >
//               <ArrowLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
//               Back to Invoices
//             </button>
//             <div className="flex items-center gap-3">
//               <h1 className="text-3xl font-bold tracking-tight text-foreground">
//                 {invoice?.invoice_number}
//               </h1>
//               <Badge
//                 variant="outline"
//                 className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles(
//                   invoice?.status
//                 )}`}
//               >
//                 {getStatusIcon(invoice?.status)}
//                 {invoice?.status}
//               </Badge>
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-2 print:hidden">
//             <Button variant="outline" size="sm" className="h-9 shadow-sm">
//               <Printer className="mr-2 h-4 w-4" />
//               Print
//             </Button>
//             <Button variant="outline" size="sm" className="h-9 shadow-sm">
//               <Download className="mr-2 h-4 w-4" />
//               PDF
//             </Button>
//             {invoice.status !== "Paid" && invoice.status !== "Cancelled" && (
//               <Button size="sm" className="h-9 shadow-sm bg-slate-900 text-white hover:bg-slate-800">
//                 <CreditCard className="mr-2 h-4 w-4" />
//                 Add Payment
//               </Button>
//             )}
//           </div>
//         </div>

//         <Separator />

//         {/* Main Grid Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
//           {/* Left Column (Content) */}
//           <div className="lg:col-span-8 space-y-6">
            
//             {/* 2️⃣ Invoice Summary Card */}
//             <Card className="shadow-sm border-border/60">
//               <CardHeader className="pb-4">
//                 <CardTitle className="text-base font-medium flex items-center gap-2">
//                   <Hash className="h-4 w-4 text-muted-foreground" />
//                   Invoice Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-1">
//                     <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                       Invoice Date
//                     </p>
//                     <div className="flex items-center gap-2">
//                       <Calendar className="h-4 w-4 text-slate-400" />
//                       <p className="text-sm font-medium text-foreground">
//                         {formatDate(invoice?.invoice_date)}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="space-y-1">
//                     <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                       Due Date
//                     </p>
//                     <div className="flex items-center gap-2">
//                       <Clock className="h-4 w-4 text-slate-400" />
//                       <p className="text-sm font-medium text-foreground">
//                         {formatDate(invoice.due_date)}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="space-y-1">
//                     <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                       Created
//                     </p>
//                     <p className="text-sm text-foreground">
//                       {new Date(invoice.created_at).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className="space-y-1">
//                     <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                       Last Updated
//                     </p>
//                     <p className="text-sm text-foreground">
//                       {new Date(invoice.updated_at).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* 3️⃣ Customer Information Card */}
//             <Card className="shadow-sm border-border/60">
//               <CardHeader className="pb-4">
//                 <CardTitle className="text-base font-medium flex items-center gap-2">
//                   <User className="h-4 w-4 text-muted-foreground" />
//                   Customer Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div className="space-y-1.5">
//                     <p className="text-xs text-muted-foreground">Name</p>
//                     <p className="text-sm font-medium text-foreground">
//                       {invoice.customer?.name}
//                     </p>
//                   </div>
//                   <div className="space-y-1.5">
//                     <p className="text-xs text-muted-foreground">Email</p>
//                     <div className="flex items-center gap-2">
//                       <Mail className="h-3.5 w-3.5 text-slate-400" />
//                       <a
//                         href={`mailto:${invoice.customer?.email}`}
//                         className="text-sm text-foreground hover:underline hover:text-primary transition-colors"
//                       >
//                         {invoice.customer?.email}
//                       </a>
//                     </div>
//                   </div>
//                   <div className="space-y-1.5">
//                     <p className="text-xs text-muted-foreground">Phone</p>
//                     <div className="flex items-center gap-2">
//                       <Phone className="h-3.5 w-3.5 text-slate-400" />
//                       <a
//                         href={`tel:${invoice.customer?.phone}`}
//                         className="text-sm text-foreground hover:underline hover:text-primary transition-colors"
//                       >
//                         {invoice.customer?.phone}
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* 4️⃣ Line Items Section */}
//             <Card className="shadow-sm border-border/60 overflow-hidden">
//               <CardHeader className="pb-0">
//                 <CardTitle className="text-base font-medium flex items-center gap-2">
//                   <FileText className="h-4 w-4 text-muted-foreground" />
//                   Line Items
//                 </CardTitle>
//                 <CardDescription>
//                   Services and products billed in this invoice.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="p-0 mt-6">
//                 <Table>
//                   <TableHeader className="bg-muted/40">
//                     <TableRow>
//                       <TableHead className="pl-6 w-[50%]">Description</TableHead>
//                       <TableHead className="text-right">Qty</TableHead>
//                       <TableHead className="text-right">Unit Price</TableHead>
//                       <TableHead className="text-right pr-6">Amount</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {invoice.line_items.map((item, index) => (
//                       <TableRow key={index} className="hover:bg-muted/50">
//                         <TableCell className="pl-6 font-medium text-foreground">
//                           {item.description}
//                         </TableCell>
//                         <TableCell className="text-right text-muted-foreground">
//                           {item.quantity}
//                         </TableCell>
//                         <TableCell className="text-right text-muted-foreground font-mono">
//                           {formatCurrency(item.unit_price)}
//                         </TableCell>
//                         <TableCell className="text-right pr-6 font-mono font-medium text-foreground">
//                           {formatCurrency(item.amount)}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Column (Financials & Notes) */}
//           <div className="lg:col-span-4 space-y-6">
            
//             {/* 5️⃣ Financial Summary Section */}
//             <Card className="shadow-lg border-border/60 bg-card">
//               <CardHeader className="bg-slate-50/50 pb-4 border-b">
//                 <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
//                   Summary
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6 space-y-4">
//                 <div className="flex justify-between items-center text-sm">
//                   <span className="text-muted-foreground">Subtotal</span>
//                   <span className="font-mono font-medium text-foreground">
//                     {formatCurrency(
//                       invoice.line_items.reduce((acc, item) => acc + item.amount, 0)
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center text-sm">
//                   <span className="text-muted-foreground">
//                     Tax ({invoice.tax_rate}%)
//                   </span>
//                   <span className="font-mono font-medium text-foreground">
//                     {formatCurrency(invoice.tax_amount)}
//                   </span>
//                 </div>
                
//                 <Separator className="my-2" />
                
//                 <div className="flex justify-between items-center">
//                   <span className="text-base font-semibold text-foreground">
//                     Grand Total
//                   </span>
//                   <span className="text-xl font-bold font-mono text-foreground">
//                     {formatCurrency(invoice.total)}
//                   </span>
//                 </div>

//                 {invoice.status === "Paid" && (
//                    <div className="mt-4 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-2 rounded-md flex items-center justify-center border border-emerald-100">
//                       <CheckCircle2 className="w-3 h-3 mr-1.5" />
//                       Paid in full on {new Date(invoice.updated_at).toLocaleDateString()}
//                    </div>
//                 )}
//               </CardContent>
//               <CardFooter className="bg-slate-50/50 border-t p-4 text-xs text-muted-foreground text-center">
//                 Payment due by {new Date(invoice.due_date).toLocaleDateString()}
//               </CardFooter>
//             </Card>

//             {/* 6️⃣ Notes Section */}
//             {invoice.notes && (
//               <Card className="shadow-none bg-yellow-50/50 border-yellow-100">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium text-yellow-800 flex items-center gap-2">
//                      <FileText className="h-4 w-4" />
//                      Notes
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-sm text-yellow-700 leading-relaxed">
//                     {invoice.notes}
//                   </p>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Metadata (Optional filler for CRM look) */}
//             <div className="text-xs text-muted-foreground space-y-1 px-1">
//                <p>Invoice ID: <span className="font-mono select-all">{invoice.id}</span></p>
//                <p>Customer ID: <span className="font-mono select-all">{invoice.customer?.id}</span></p>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import React from "react";
import { 
  FileText, 
  Printer, 
  Download, 
  CreditCard, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Wallet, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableFooter
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useInvoice } from "@/hooks/use-invoices";

// --- TypeScript Interfaces ---

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

interface Payment {
  id: string;
  date: string;
  method: string;
  category: string;
  reference_id: string;
  notes?: string;
  amount: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  status: "Pending" | "Paid" | "Overdue" | "Partially Paid";
  date: string;
  due_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  payment_amount: number; // Subtotal
  tax_rate: number;
  tax_amount: number;
  grand_total: number;
  total_paid: number;
  remaining_amount: number;
  notes?: string;
  line_items: LineItem[];
  payments: Payment[];
}

interface InvoiceDetailsPageProps {
  invoice: Invoice;
}

// --- Helper Functions ---

const formatCurrency = (val: number) => 
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

const getStatusConfig = (status: string, dueDate: string) => {
  const isOverdue = new Date(dueDate) < new Date() && status !== "Paid";
  
  if (isOverdue || status === "Overdue") return { color: "bg-red-50 text-red-700 border-red-200", icon: AlertCircle, label: "Overdue" };
  if (status === "Paid") return { color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2, label: "Paid" };
  if (status === "Partially Paid") return { color: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock, label: "Partially Paid" };
  return { color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock, label: "Pending" };
};

// --- Component ---

export default function InvoiceDetailsPage() {

  const params = useParams();
      const id = params.id as string;
  const router = useRouter();
  // In a real app, fetch data based on params.id
  const {data:invoice, isLoading, error} = useInvoice(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">
            Loading invoice details...
          </p>
        </div>
      </div>
    );
  }
if (error) return <div>Error: {error.message}</div>;
if (!invoice) return null; // ✅ ADD THIS
  const status = getStatusConfig(invoice.status, invoice.due_date);
  const percentPaid = (invoice.total_paid / invoice.total) * 100;

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8 lg:p-12 space-y-8 max-w-7xl mx-auto">
      
      {/* 1️⃣ HEADER SECTION */}
      <div className="flex flex-col gap-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Dashboard</span>
          <span>/</span>
          <span>Invoices</span>
          <span>/</span>
          <span className="text-foreground font-medium">{invoice.invoice_number}</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-border">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{invoice.invoice_number}</h1>
                <Badge className={cn("px-3 py-1 rounded-full border shadow-none font-semibold", status.color)}>
                  <status.icon className="w-3.5 h-3.5 mr-1.5" />
                  {status.label}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-1 text-muted-foreground text-sm">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Issued: {invoice.invoice_date}
                </span>
                <span className={cn("flex items-center gap-1.5 font-medium", status.label === "Overdue" && "text-red-600")}>
                  <Calendar className="w-4 h-4" /> Due: {invoice.due_date}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="bg-white hover:bg-slate-50">
              <Printer className="w-4 h-4 mr-2" /> Print
            </Button>
            <Button variant="outline" className="bg-white hover:bg-slate-50">
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
            <Button className="shadow-lg shadow-primary/20">
              <CreditCard className="w-4 h-4 mr-2" /> Add Payment
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2️⃣ CUSTOMER CARD */}
        <Card className="rounded-xl border-none shadow-sm ring-1 ring-border overflow-hidden">
          <CardHeader className="bg-muted/30 border-b py-4">
            <CardTitle className="text-base flex items-center gap-2 font-semibold">
              <User className="w-4 h-4 text-primary" /> Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-lg font-bold text-foreground">{invoice?.customer?.name}</p>
            </div>
            <Separator className="bg-border/50" />
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                <span>{invoice?.customer?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" />
                <span>{invoice?.customer?.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3️⃣ FINANCIAL SUMMARY CARD */}
        <Card className="lg:col-span-2 rounded-xl border-none shadow-sm ring-1 ring-border overflow-hidden">
          <CardHeader className="bg-muted/30 border-b py-4">
            <CardTitle className="text-base flex items-center gap-2 font-semibold">
              <CreditCard className="w-4 h-4 text-primary" /> Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(invoice.payment_amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({invoice.tax_rate}%)</span>
                  <span className="font-medium">{formatCurrency(invoice.tax_amount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold">Grand Total</span>
                  <span className="text-2xl font-black text-foreground">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
              </div>

              <div className="space-y-4 bg-muted/20 p-4 rounded-xl border border-dashed border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Total Paid
                  </span>
                  <span className="text-green-600 font-bold">{formatCurrency(invoice.total_paid)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={cn("font-semibold flex items-center gap-1.5", invoice.remaining_amount > 0 ? "text-red-600" : "text-green-600")}>
                    <Clock className="w-4 h-4" /> Remaining
                  </span>
                  <span className={cn("font-bold", invoice.remaining_amount > 0 ? "text-red-600" : "text-green-600")}>
                    {formatCurrency(invoice.remaining_amount)}
                  </span>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                    <span>Payment Progress</span>
                    <span>{((invoice.total_paid / invoice.total) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={percentPaid} className="h-2 bg-slate-200" />
                  {invoice.remaining_amount > 0 && invoice.total_paid > 0 && (
                    <p className="text-[11px] text-amber-600 font-medium italic text-right">Partial payment received</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4️⃣ LINE ITEMS SECTION */}
      <Card className="rounded-xl border-none shadow-sm ring-1 ring-border overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Invoice Items</h3>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[50%]">Description</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.line_items.map((item) => (
                  <TableRow key={item.description} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-slate-700">{item.description}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.unit_price)}</TableCell>
                    <TableCell className="text-right font-bold text-foreground font-mono">{formatCurrency(item.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="bg-muted/10">
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-semibold text-muted-foreground">Subtotal</TableCell>
                  <TableCell className="text-right font-black text-lg">{formatCurrency(invoice.payment_amount)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </Card>

      {/* 5️⃣ PAYMENT HISTORY SECTION */}
      <Card className="rounded-xl border-none shadow-sm ring-1 ring-border overflow-hidden">
        <CardHeader className="bg-muted/30 border-b py-4">
          <CardTitle className="text-base flex items-center gap-2 font-semibold">
            <Wallet className="w-4 h-4 text-primary" /> Payment History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {invoice.transactions.length > 0 ? (
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Category / Ref</TableHead>
                  <TableHead className="text-right pr-6">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...invoice.transactions].sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="pl-6 font-medium">{p.transaction_date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal bg-white border">{p.payment_method}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{p.payment_method}</span>
                        <span className="text-[11px] text-muted-foreground font-mono uppercase">{p.reference_id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6 font-bold text-green-600 font-mono">
                      + {formatCurrency(p.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="bg-green-50/50">
                <TableRow>
                  <TableCell colSpan={3} className="pl-6 font-bold text-green-700">Total Collected</TableCell>
                  <TableCell className="text-right pr-6 font-black text-green-700 text-lg">{formatCurrency(invoice.total_paid)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <Wallet className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No payment transactions recorded for this invoice.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 6️⃣ NOTES SECTION */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="rounded-xl border-none shadow-sm ring-1 ring-border overflow-hidden">
          <CardHeader className="bg-muted/30 border-b py-4">
            <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground font-bold">Notes & Terms</CardTitle>
          </CardHeader>
          <CardContent className={cn("pt-6 text-sm leading-relaxed", !invoice.notes && "bg-muted/10 italic text-muted-foreground")}>
            {invoice.notes || "No additional notes provided for this invoice."}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center pt-8 pb-4">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary transition-all">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Invoices
        </Button>
      </div>
    </div>
  );
}