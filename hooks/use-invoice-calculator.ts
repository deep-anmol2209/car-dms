/**
 * Invoice Calculator Hook
 * Handles all pricing calculations with proper TypeScript
 */

import { useMemo } from 'react';
import { TAX_RATES, TaxCalculation, TaxMode, LineItem } from '@/types/invoice';

interface UseInvoiceCalculatorParams {
  basePrice: number;
  packageFee: number;
  discount: number;
  taxMode: TaxMode;
  lineItems: Array<{ quantity: number; unit_price: number }>;
}

export function useInvoiceCalculator({
  basePrice,
  packageFee,
  discount,
  taxMode,
  lineItems,
}: UseInvoiceCalculatorParams): TaxCalculation {
  return useMemo((): TaxCalculation => {
    // Calculate line items total
    const lineItemsTotal = lineItems.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );

    // Calculate subtotal
    const subtotal = Math.max(0, basePrice + packageFee + lineItemsTotal - discount);

    // Calculate taxes
    let gst = 0;
    let pst = 0;
    let taxAmount = 0;

    if (taxMode === 'gst+pst') {
      gst = subtotal * TAX_RATES.gst;
      pst = subtotal * TAX_RATES.pst;
      taxAmount = gst + pst;
    } else {
      taxAmount = subtotal * TAX_RATES.hst;
    }

    const grandTotal = subtotal + taxAmount;

    // Round to 2 decimal places
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      gst: Math.round(gst * 100) / 100,
      pst: Math.round(pst * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      grandTotal: Math.round(grandTotal * 100) / 100,
    };
  }, [basePrice, packageFee, discount, taxMode, lineItems]);
}