'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvoiceCalculation } from '@/lib/validations/invoice';

interface InvoicePreviewProps {
  customerName?: string;
  customerAddress?: string;
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
  invoiceDate?: Date;
  dueDate?: Date;
  invoiceNumber?: string;
}

export function InvoicePreview({
  customerName,
  customerAddress,
  vehicleInfo,
  calculation,
  packageName,
  lineItems = [],
  invoiceDate,
  dueDate,
  invoiceNumber,
}: InvoicePreviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Invoice Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">ADAPTUS DMS</h2>
              <p className="text-sm text-slate-500">Dealer Management System</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Invoice #</p>
              <p className="font-semibold">{invoiceNumber || 'INV-0001'}</p>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div>
          <h3 className="font-semibold text-slate-700 mb-2">Bill To:</h3>
          <div className="text-sm text-slate-600">
            {customerName ? (
              <>
                <p className="font-medium">{customerName}</p>
                {customerAddress && <p>{customerAddress}</p>}
              </>
            ) : (
              <p className="text-slate-400">Select a customer</p>
            )}
          </div>
        </div>

        {/* Vehicle Details */}
        {vehicleInfo && (vehicleInfo.make || vehicleInfo.vin) && (
          <div>
            <h3 className="font-semibold text-slate-700 mb-2">Vehicle Details:</h3>
            <div className="text-sm space-y-1">
              {vehicleInfo.year && vehicleInfo.make && vehicleInfo.model && (
                <p><span className="font-medium">Vehicle:</span> {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}</p>
              )}
              {vehicleInfo.vin && (
                <p><span className="font-medium">VIN:</span> {vehicleInfo.vin}</p>
              )}
              {vehicleInfo.odometer && (
                <p><span className="font-medium">Odometer:</span> {vehicleInfo.odometer.toLocaleString()} miles</p>
              )}
            </div>
          </div>
        )}

        {/* Line Items */}
        <div>
          <h3 className="font-semibold text-slate-700 mb-2">Items:</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-2 font-medium">Description</th>
                  <th className="text-right p-2 font-medium">Qty</th>
                  <th className="text-right p-2 font-medium">Price</th>
                  <th className="text-right p-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{item.description || 'Item'}</td>
                    <td className="p-2 text-right">{item.quantity}</td>
                    <td className="p-2 text-right">{formatCurrency(item.unit_price)}</td>
                    <td className="p-2 text-right font-medium">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
                {packageName && (
                  <tr className="border-t">
                    <td className="p-2">{packageName} Package</td>
                    <td className="p-2 text-right">1</td>
                    <td className="p-2 text-right">-</td>
                    <td className="p-2 text-right font-medium">-</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="border-t pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(calculation.subtotal)}</span>
            </div>
            {calculation.gst > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">GST (5%):</span>
                <span className="font-medium">{formatCurrency(calculation.gst)}</span>
              </div>
            )}
            {calculation.pst > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">PST (7%):</span>
                <span className="font-medium">{formatCurrency(calculation.pst)}</span>
              </div>
            )}
            {calculation.taxAmount > 0 && calculation.gst === 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">HST (13%):</span>
                <span className="font-medium">{formatCurrency(calculation.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 font-bold text-lg">
              <span>Total Due:</span>
              <span className="text-teal-600">{formatCurrency(calculation.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Dates */}
        {(invoiceDate || dueDate) && (
          <div className="text-xs text-slate-500 space-y-1">
            {invoiceDate && (
              <p>Invoice Date: {invoiceDate.toLocaleDateString()}</p>
            )}
            {dueDate && (
              <p>Due Date: {dueDate.toLocaleDateString()}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
