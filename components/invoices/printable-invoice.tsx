// 'use client';

// import { InvoiceCalculation } from '@/lib/validations/invoice';

// interface PrintableInvoiceProps {
//   invoiceNumber: string;
//   invoiceDate: Date;
//   dueDate: Date;
//   customerName: string;
//   customerAddress?: string;
//   customerPhone?: string | null;
//   customerEmail?: string | null;
//   vehicleInfo?: {
//     year?: number;
//     make?: string;
//     model?: string;
//     vin?: string;
//     odometer?: number;
//     color?: string; // Added for completeness, optional
//   };
//   calculation: InvoiceCalculation;
//   packageName?: string;
//   lineItems?: Array<{
//     description: string;
//     quantity: number;
//     unit_price: number;
//     amount: number;
//   }>;
//   dealershipName?: string;
//   dealershipAddress?: string;
//   dealershipPhone?: string;
//   dealershipEmail?: string;
// }

// export function PrintableInvoice({
//   invoiceNumber,
//   invoiceDate,
//   dueDate,
//   customerName,
//   customerAddress,
//   customerPhone,
//   customerEmail,
//   vehicleInfo,
//   calculation,
//   packageName,
//   lineItems = [],
//   dealershipName = 'Adaptus DMS',
//   dealershipAddress = '123 Business Street, City, State 12345',
//   dealershipPhone = '(555) 123-4567',
//   dealershipEmail = 'info@adaptusdms.com',
// }: PrintableInvoiceProps) {
  
//   const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(value);
//   };

//   const formatDate = (date: Date) => {
//     return new Intl.DateTimeFormat('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//     }).format(date);
//   };

//   return (
//     <div className="hidden print:block" id="printable-invoice">
//       <style jsx global>{`
//         @media print {
//           @page {
//             size: letter;
//             margin: 0; /* We handle margin in the container to allow full bleed headers if needed */
//           }
          
//           body {
//             background: white;
//             -webkit-print-color-adjust: exact !important;
//             print-color-adjust: exact !important;
//           }
          
//           body * {
//             visibility: hidden;
//           }
          
//           #printable-invoice,
//           #printable-invoice * {
//             visibility: visible;
//           }
          
//           #printable-invoice {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//             min-height: 100vh;
//             background: white;
//             padding: 0.5in; /* Standard print margin */
//           }
//         }
//       `}</style>

//       {/* Main Container */}
//       <div className="max-w-[8.5in] mx-auto bg-white text-slate-900 font-sans">
        
//         {/* 1. Header Section */}
//         <div className="flex justify-between items-start mb-12">
//           {/* Brand / Logo Area */}
//           <div className="w-1/2">
//             <div className="flex items-center gap-3 mb-4">
//               {/* Geometric Logo Placeholder */}
//               <div className="w-10 h-10 bg-slate-900 rounded-sm flex items-center justify-center">
//                 <span className="text-white font-bold text-xl">A</span>
//               </div>
//               <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
//                 {dealershipName}
//               </h1>
//             </div>
//             <div className="text-xs text-slate-500 leading-relaxed pl-1">
//               <p>{dealershipAddress}</p>
//               <p>{dealershipPhone} &bull; {dealershipEmail}</p>
//             </div>
//           </div>

//           {/* Invoice Meta */}
//           <div className="w-1/2 text-right">
//             <h2 className="text-4xl font-light text-slate-300 tracking-tight mb-4">INVOICE</h2>
//             <div className="inline-block text-left min-w-[200px]">
//               <div className="flex justify-between border-b border-slate-100 py-1">
//                 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice #</span>
//                 <span className="text-sm font-medium text-slate-900">{invoiceNumber}</span>
//               </div>
//               <div className="flex justify-between border-b border-slate-100 py-1">
//                 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</span>
//                 <span className="text-sm font-medium text-slate-900">{formatDate(invoiceDate)}</span>
//               </div>
//               <div className="flex justify-between py-1">
//                 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</span>
//                 <span className="text-sm font-medium text-slate-900">{formatDate(dueDate)}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 2. Info Grid (Bill To / Ship To) */}
//         <div className="grid grid-cols-2 gap-12 mb-10">
//           <div>
//             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Bill To</h3>
//             <div className="text-sm text-slate-800 leading-relaxed">
//               <p className="font-bold text-lg text-slate-900 mb-1">{customerName}</p>
//               {customerAddress && <p className="text-slate-600 max-w-[250px]">{customerAddress}</p>}
//               <div className="mt-3 space-y-0.5">
//                 {customerPhone && (
//                   <p className="text-slate-600 flex items-center gap-2">
//                     <span className="w-4 h-4 flex items-center justify-center bg-slate-100 rounded text-[10px] text-slate-500">P</span>
//                     {customerPhone}
//                   </p>
//                 )}
//                 {customerEmail && (
//                   <p className="text-slate-600 flex items-center gap-2">
//                     <span className="w-4 h-4 flex items-center justify-center bg-slate-100 rounded text-[10px] text-slate-500">@</span>
//                     {customerEmail}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
          
//           {/* Optional: You could put dealership Tax ID or notes here */}
//           <div className="bg-slate-50 p-4 rounded-sm border border-slate-100">
//              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Service Note</h3>
//              <p className="text-xs text-slate-500 leading-relaxed">
//                Thank you for choosing {dealershipName}. Please retain this invoice for your service records.
//                All parts and labor are guaranteed for 12 months or 12,000 miles, whichever occurs first.
//              </p>
//           </div>
//         </div>

//         {/* 3. Vehicle "Spec Bar" */}
//         {(vehicleInfo?.make || vehicleInfo?.vin) && (
//           <div className="mb-10">
//              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Vehicle Details</h3>
//             <div className="flex w-full bg-slate-900 text-white rounded-sm overflow-hidden print:bg-slate-900 print:text-white">
//               <div className="flex-1 py-3 px-4 border-r border-slate-700">
//                 <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Vehicle</p>
//                 <p className="font-semibold text-sm truncate">
//                   {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
//                 </p>
//               </div>
//               <div className="flex-1 py-3 px-4 border-r border-slate-700">
//                 <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">VIN</p>
//                 <p className="font-mono text-sm tracking-wide">{vehicleInfo.vin || 'N/A'}</p>
//               </div>
//               <div className="flex-1 py-3 px-4">
//                 <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Odometer</p>
//                 <p className="font-mono text-sm">{vehicleInfo.odometer ? vehicleInfo.odometer.toLocaleString() : '---'} mi</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* 4. Line Items Table */}
//         <div className="mb-10">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b-2 border-slate-900">
//                 <th className="py-3 text-left font-bold text-xs uppercase tracking-wider text-slate-900 w-1/2">Description</th>
//                 <th className="py-3 text-center font-bold text-xs uppercase tracking-wider text-slate-900">Qty</th>
//                 <th className="py-3 text-right font-bold text-xs uppercase tracking-wider text-slate-900">Rate</th>
//                 <th className="py-3 text-right font-bold text-xs uppercase tracking-wider text-slate-900">Amount</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {lineItems.map((item, index) => (
//                 <tr key={index}>
//                   <td className="py-4 text-slate-800 font-medium">{item.description}</td>
//                   <td className="py-4 text-center text-slate-600">{item.quantity}</td>
//                   <td className="py-4 text-right text-slate-600 tabular-nums">{formatCurrency(item.unit_price)}</td>
//                   <td className="py-4 text-right text-slate-900 font-semibold tabular-nums">{formatCurrency(item.amount)}</td>
//                 </tr>
//               ))}
//               {packageName && (
//                 <tr>
//                   <td className="py-4 text-slate-800">
//                     <span className="font-medium">{packageName}</span>
//                     <span className="text-slate-500 text-xs ml-2">(Service Package)</span>
//                   </td>
//                   <td className="py-4 text-center text-slate-600">1</td>
//                   <td className="py-4 text-right text-slate-600">-</td>
//                   <td className="py-4 text-right text-slate-900">-</td>
//                 </tr>
//               )}
//               {/* Fill remaining space visually if list is short (optional for aesthetics) */}
//               {lineItems.length < 3 && (
//                  <tr><td colSpan={4} className="py-8"></td></tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* 5. Footer Layout: Notes & Totals */}
//         <div className="flex flex-row justify-between items-start pt-4 border-t-2 border-slate-900">
          
//           {/* Left: Terms/Notes */}
//           <div className="w-5/12 pt-2">
//             <h4 className="text-xs font-bold text-slate-900 uppercase mb-2">Terms & Conditions</h4>
//             <p className="text-[10px] text-slate-500 leading-normal text-justify">
//               Payment is due upon receipt. Please include invoice number on your check. 
//               Interest of 1.5% per month will be charged on all past due accounts. 
//               Goods remain the property of {dealershipName} until paid in full.
//             </p>
//           </div>

//           {/* Right: Calculation */}
//           <div className="w-5/12">
//             <div className="space-y-3">
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-500">Subtotal</span>
//                 <span className="text-slate-900 font-medium tabular-nums">{formatCurrency(calculation.subtotal)}</span>
//               </div>
              
//               {/* Taxes Logic */}
//               {(calculation.gst > 0 || calculation.pst > 0 || calculation.taxAmount > 0) && (
//                 <div className="space-y-1 py-2 border-y border-slate-100 border-dashed">
//                     {calculation.gst > 0 && (
//                       <div className="flex justify-between text-xs">
//                         <span className="text-slate-500">GST (5%)</span>
//                         <span className="text-slate-700 tabular-nums">{formatCurrency(calculation.gst)}</span>
//                       </div>
//                     )}
//                     {calculation.pst > 0 && (
//                       <div className="flex justify-between text-xs">
//                         <span className="text-slate-500">PST (7%)</span>
//                         <span className="text-slate-700 tabular-nums">{formatCurrency(calculation.pst)}</span>
//                       </div>
//                     )}
//                     {calculation.taxAmount > 0 && calculation.gst === 0 && (
//                       <div className="flex justify-between text-xs">
//                         <span className="text-slate-500">HST/Tax</span>
//                         <span className="text-slate-700 tabular-nums">{formatCurrency(calculation.taxAmount)}</span>
//                       </div>
//                     )}
//                 </div>
//               )}

//               <div className="flex justify-between items-center pt-2">
//                 <span className="text-base font-bold text-slate-900 uppercase tracking-tight">Total Due</span>
//                 <div className="text-2xl font-bold text-slate-900 tabular-nums">
//                   {formatCurrency(calculation.grandTotal)}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 6. Signature Area */}
//         <div className="mt-16 grid grid-cols-2 gap-12">
//            <div>
//              <div className="border-b border-slate-300 mb-2"></div>
//              <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
//                 <span>Customer Signature</span>
//                 <span>Date</span>
//              </div>
//            </div>
//            <div>
//              <div className="border-b border-slate-300 mb-2"></div>
//              <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
//                 <span>Authorized Signature</span>
//                 <span>Date</span>
//              </div>
//            </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// 'use client';

// import { InvoiceCalculation } from '@/lib/validations/invoice';

// interface PrintableInvoiceProps {
//   isVisible: boolean;

//   invoiceNumber: string;
//   invoiceDate: Date;
//   dueDate: Date;
//   customerName: string;
//   customerAddress?: string;
//   customerPhone?: string | null;
//   customerEmail?: string | null;

//   vehicleInfo?: {
//     year?: number;
//     make?: string;
//     model?: string;
//     vin?: string;
//     odometer?: number;
//   };

//   calculation: InvoiceCalculation;
//   packageName?: string;

//   lineItems?: Array<{
//     description: string;
//     quantity: number;
//     unit_price: number;
//     amount: number;
//   }>;

//   dealershipName?: string;
//   dealershipAddress?: string;
//   dealershipPhone?: string;
//   dealershipEmail?: string;
// }

// export function PrintableInvoice({
//   isVisible,
//   invoiceNumber,
//   invoiceDate,
//   dueDate,
//   customerName,
//   customerAddress,
//   customerPhone,
//   customerEmail,
//   vehicleInfo,
//   calculation,
//   packageName,
//   lineItems = [],
//   dealershipName = 'ADAPTUS DMS',
//   dealershipAddress = '123 Business Street, City, State 12345',
//   dealershipPhone = '(555) 123-4567',
//   dealershipEmail = 'billing@adaptusdms.com',
// }: PrintableInvoiceProps) {
//   const formatCurrency = (value: number) =>
//     new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//     }).format(value);

//   const formatDate = (date: Date) =>
//     new Intl.DateTimeFormat('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//     }).format(date);

//   return (
//     <div
//       id="printable-invoice"
//       className={isVisible ? 'block' : 'hidden'}
//     >
//       {/* 🔥 CRITICAL PRINT FIX */}
//       <style jsx global>{`
//         @media print {
//           @page {
//             size: auto;
//             margin: 0;
//           }

//           body {
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//           }

//           body * {
//             visibility: hidden;
//           }

//           #printable-invoice,
//           #printable-invoice * {
//             visibility: visible;
//           }

//           #printable-invoice {
//             position: absolute;
//             inset: 0;
//             background: white;
//           }
//         }
//       `}</style>

//       {/* ================= INVOICE SHEET ================= */}
//       <div className="mx-auto max-w-[8.5in] min-h-[11in] bg-white px-10 py-12 text-slate-900 font-sans">

//         {/* ================= HEADER ================= */}
//         <div className="grid grid-cols-2 gap-8 border-b-2 border-slate-900 pb-6 mb-10">
//           <div>
//             <div className="flex items-center gap-3 mb-3">
//               <div className="h-10 w-10 bg-slate-900 text-white flex items-center justify-center font-bold rounded">
//                 AD
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold uppercase tracking-tight">
//                   {dealershipName}
//                 </h1>
//                 <p className="text-xs text-slate-500 tracking-widest">
//                   AUTOMOTIVE SYSTEMS
//                 </p>
//               </div>
//             </div>

//             <p className="text-sm text-slate-600">{dealershipAddress}</p>
//             <p className="text-sm text-slate-600">
//               {dealershipEmail} • {dealershipPhone}
//             </p>
//           </div>

//           <div className="text-right">
//             <h2 className="text-4xl font-light text-slate-300 mb-4">
//               INVOICE
//             </h2>

//             <div className="space-y-1 text-sm">
//               <div className="flex justify-end gap-3">
//                 <span className="text-slate-400 uppercase text-xs">Invoice #</span>
//                 <span className="font-semibold">{invoiceNumber}</span>
//               </div>
//               <div className="flex justify-end gap-3">
//                 <span className="text-slate-400 uppercase text-xs">Date</span>
//                 <span>{formatDate(invoiceDate)}</span>
//               </div>
//               <div className="flex justify-end gap-3">
//                 <span className="text-slate-400 uppercase text-xs">Due</span>
//                 <span>{formatDate(dueDate)}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ================= BILL TO + TOTAL ================= */}
//         <div className="grid grid-cols-2 gap-10 mb-12">
//           <div>
//             <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">
//               Bill To
//             </p>
//             <p className="text-lg font-bold">{customerName}</p>
//             {customerAddress && (
//               <p className="text-sm text-slate-600">{customerAddress}</p>
//             )}
//             {customerPhone && (
//               <p className="text-sm text-slate-600">{customerPhone}</p>
//             )}
//             {customerEmail && (
//               <p className="text-sm text-slate-600">{customerEmail}</p>
//             )}
//           </div>

//           <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-right">
//             <p className="text-xs uppercase tracking-widest text-slate-400">
//               Total Amount Due
//             </p>
//             <p className="text-4xl font-bold mt-2 tabular-nums">
//               {formatCurrency(calculation.grandTotal)}
//             </p>
//             <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-slate-200">
//               Payment Due
//             </span>
//           </div>
//         </div>

//         {/* ================= VEHICLE ================= */}
//         {(vehicleInfo?.make || vehicleInfo?.vin) && (
//           <div className="grid grid-cols-3 bg-slate-900 text-white rounded mb-10 text-sm">
//             <div className="p-4 border-r border-slate-700">
//               <p className="text-xs text-slate-400 uppercase">Vehicle</p>
//               <p className="font-semibold">
//                 {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
//               </p>
//             </div>
//             <div className="p-4 border-r border-slate-700">
//               <p className="text-xs text-slate-400 uppercase">VIN</p>
//               <p className="font-mono">{vehicleInfo.vin}</p>
//             </div>
//             <div className="p-4">
//               <p className="text-xs text-slate-400 uppercase">Mileage</p>
//               <p className="font-mono">
//                 {vehicleInfo.odometer?.toLocaleString() ?? '—'}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* ================= LINE ITEMS ================= */}
//         <table className="w-full text-sm mb-10">
//           <thead className="border-b border-slate-300 text-xs uppercase text-slate-500">
//             <tr>
//               <th className="text-left py-3 w-1/2">Description</th>
//               <th className="text-center py-3">Qty</th>
//               <th className="text-right py-3">Unit Price</th>
//               <th className="text-right py-3">Amount</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y">
//             {lineItems.map((item, i) => (
//               <tr key={i}>
//                 <td className="py-4 font-medium">{item.description}</td>
//                 <td className="text-center">{item.quantity}</td>
//                 <td className="text-right tabular-nums">
//                   {formatCurrency(item.unit_price)}
//                 </td>
//                 <td className="text-right font-semibold tabular-nums">
//                   {formatCurrency(item.amount)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* ================= TOTALS ================= */}
//         <div className="flex justify-end">
//           <div className="w-1/3 space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>{formatCurrency(calculation.subtotal)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Tax</span>
//               <span>{formatCurrency(calculation.taxAmount)}</span>
//             </div>
//             <div className="flex justify-between pt-3 border-t font-bold text-lg">
//               <span>Total</span>
//               <span>{formatCurrency(calculation.grandTotal)}</span>
//             </div>
//           </div>
//         </div>

//         {/* ================= SIGNATURES ================= */}
//         <div className="grid grid-cols-2 gap-12 mt-16 text-xs text-slate-500">
//           <div>
//             <div className="border-t pt-2">Customer Signature</div>
//           </div>
//           <div>
//             <div className="border-t pt-2">Authorized Signature</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






'use client';

import { InvoiceCalculation } from '@/lib/validations/invoice';

interface PrintableInvoiceProps {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  customerName: string;
  customerAddress?: string;
  customerPhone?: string | null;
  customerEmail?: string | null;
  transactions?: Array<{
    id: string;
    transaction_date: string;
    payment_method: string;
    reference_id?: string | null;
    amount: number;
  }>;
  totalPaid: number | null;
  remainingAmount: number | null;
  vehicleInfo?: {
    year?: number;
    make?: string;
    model?: string;
    vin?: string;
    odometer?: number;
  };
  calculation: InvoiceCalculation;
  packageName?: string;
  lineItems?: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
  }>;
  dealershipName?: string;
  dealershipAddress?: string;
  dealershipPhone?: string;
  dealershipEmail?: string;
}

export function PrintableInvoice({
  invoiceNumber,
  invoiceDate,
  dueDate,
  customerName,
  customerAddress,
  customerPhone,
  customerEmail,
  vehicleInfo,
  calculation,
  packageName,
  lineItems = [],
  transactions = [],
  totalPaid,
  remainingAmount,
  dealershipName = 'ADAPTUS DMS',
  dealershipAddress = '123 Business Street, City, State 12345',
  dealershipPhone = '(555) 123-4567',
  dealershipEmail = 'billing@adaptusdms.com',
}: PrintableInvoiceProps) {
  
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);

  const isPaid = calculation.grandTotal <= 0;

  return (
    <>
     
     <div id="print-root" className="fixed top-0 left-0 w-full bg-white z-[9999]">

        
        {/* PAPER LAYOUT: 
            Centered, max-width of A4 (210mm), padded.
        */}
        <div className="mx-auto max-w-[210mm] min-h-screen p-[15mm] flex flex-col">
          
          {/* ================= HEADER ================= */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
            {/* Logo & Company Info */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-900 text-white flex items-center justify-center font-bold text-lg rounded-sm">
                  AD
                </div>
                <div>
                  <h1 className="text-xl font-extrabold uppercase tracking-tight leading-none text-slate-900">
                    {dealershipName}
                  </h1>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                    Automotive Systems
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-500 font-medium space-y-0.5">
                <p>{dealershipAddress}</p>
                <p>{dealershipEmail} • {dealershipPhone}</p>
              </div>
            </div>

            {/* Invoice Meta Data */}
            <div className="text-right">
              <h2 className="text-4xl font-light text-slate-300 uppercase tracking-tighter mb-4">
                Invoice
              </h2>
              <div className="space-y-1">
                <div className="flex justify-end gap-6 border-b border-dashed border-slate-200 pb-1 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-center">Invoice #</span>
                  <span className="text-sm font-bold text-slate-900">{invoiceNumber}</span>
                </div>
                <div className="flex justify-end gap-6">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-center">Date</span>
                  <span className="text-sm font-medium text-slate-900">{formatDate(invoiceDate)}</span>
                </div>
                <div className="flex justify-end gap-6">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-center">Due</span>
                  <span className="text-sm font-medium text-slate-900">{formatDate(dueDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= BILLING & SUMMARY ================= */}
          <div className="flex justify-between items-start mb-10">
            {/* Bill To */}
            <div className="w-1/2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Bill To
              </h3>
              <div className="text-slate-900">
                <p className="text-xl font-bold mb-1">{customerName}</p>
                {customerAddress && <p className="text-sm text-slate-600 mb-1 max-w-[200px] leading-snug">{customerAddress}</p>}
                <div className="text-xs text-slate-500 mt-2 space-y-0.5">
                  {customerPhone && <p>Phone: {customerPhone}</p>}
                  {customerEmail && <p>Email: {customerEmail}</p>}
                </div>
              </div>
            </div>

            {/* Amount Box */}
            <div className="w-auto">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-5 text-right min-w-[200px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Amount Due
                </p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  {formatCurrency(calculation.grandTotal)}
                </p>
                <div className="mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                    {isPaid ? 'PAID IN FULL' : 'PAYMENT DUE'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= VEHICLE STRIP ================= */}
          {(vehicleInfo?.make || vehicleInfo?.vin) && (
            <div className="mb-10 bg-slate-900 text-white rounded-md overflow-hidden flex shadow-sm text-sm print:bg-slate-900 print:text-white">
              <div className="flex-1 p-4 border-r border-slate-700/50">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Vehicle</p>
                <p className="font-semibold text-white">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </p>
              </div>
              <div className="flex-1 p-4 border-r border-slate-700/50">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">VIN</p>
                <p className="font-mono text-slate-300">{vehicleInfo.vin || '—'}</p>
              </div>
              <div className="flex-1 p-4">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Odometer</p>
                <p className="font-mono text-slate-300">
                  {vehicleInfo.odometer ? `${vehicleInfo.odometer.toLocaleString()} mi` : '—'}
                </p>
              </div>
            </div>
          )}

          {/* ================= LINE ITEMS ================= */}
          <div className="mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 text-left font-bold text-[10px] text-slate-500 uppercase tracking-widest w-1/2">Description</th>
                  <th className="py-3 text-center font-bold text-[10px] text-slate-500 uppercase tracking-widest">Qty</th>
                  <th className="py-3 text-right font-bold text-[10px] text-slate-500 uppercase tracking-widest">Rate</th>
                  <th className="py-3 text-right font-bold text-[10px] text-slate-500 uppercase tracking-widest">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lineItems.map((item, index) => (
                  <tr key={index}>
                    <td className="py-4 pr-4 align-top">
                      <p className="font-semibold text-slate-900">{item.description}</p>
                    </td>
                    <td className="py-4 text-center align-top text-slate-600 font-medium">{item.quantity}</td>
                    <td className="py-4 text-right align-top text-slate-600 tabular-nums">{formatCurrency(item.unit_price)}</td>
                    <td className="py-4 text-right align-top text-slate-900 font-bold tabular-nums">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
                
                {packageName && (
                   <tr className="bg-slate-50/50">
                     <td className="py-4 pl-3">
                       <span className="font-semibold text-slate-900">{packageName}</span> 
                       <span className="text-slate-500 text-xs ml-2">(Service Package)</span>
                     </td>
                     <td className="py-4 text-center text-slate-500">1</td>
                     <td className="py-4 text-right text-slate-400 italic">Included</td>
                     <td className="py-4 text-right text-slate-400 italic">—</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>

          {transactions.length > 0 && (
  <div className="mb-8">
    <h3 className="text-sm font-semibold mb-3">Payment History</h3>
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b">
          <th className="py-2 text-left">Date</th>
          <th className="py-2 text-left">Method</th>
          <th className="py-2 text-left">Reference</th>
          <th className="py-2 text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t.id}>
            <td className="py-2">{t.transaction_date}</td>
            <td className="py-2">{t.payment_method}</td>
            <td className="py-2">{t.reference_id || '—'}</td>
            <td className="py-2 text-right font-mono">
              {formatCurrency(t.amount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


          {/* ================= FOOTER / TOTALS ================= */}
          <div className="flex justify-end mt-auto pt-4 border-t-2 border-slate-900">
            <div className="w-1/2 max-w-xs space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">{formatCurrency(calculation.subtotal)}</span>
              </div>
              
              {calculation.taxAmount > 0 && (
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Tax / VAT</span>
                  <span className="font-medium text-slate-900">{formatCurrency(calculation.taxAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-2">
                <span className="text-base font-bold text-slate-900 uppercase tracking-tight">Total</span>
                <span className="text-2xl font-bold text-slate-900 tabular-nums">{formatCurrency(calculation.grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-sm text-slate-600">
  <span>Total Paid</span>
  <span className="font-medium text-emerald-600">
  {formatCurrency(totalPaid ?? 0)}
  </span>
</div>

<div className="flex justify-between text-base font-bold text-slate-900 border-t pt-2">
  <span>Balance Due</span>
  <span className="tabular-nums">
  {formatCurrency(remainingAmount ?? calculation.grandTotal)}
  </span>
</div>


          {/* ================= SIGNATURES ================= */}
          <div className="mt-16 pt-8 grid grid-cols-2 gap-16 border-t border-slate-200">
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-12">Customer Signature</p>
                <div className="border-b border-slate-300"></div>
             </div>
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-12">Authorized Signature</p>
                <div className="border-b border-slate-300"></div>
             </div>
          </div>
          
          <div className="mt-8 text-center">
             <p className="text-[10px] text-slate-400">Thank you for your business. Please retain this invoice for your records.</p>
          </div>

        </div>
      </div>
    </>
  );
}