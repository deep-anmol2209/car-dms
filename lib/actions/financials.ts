'use server';

import { createClient } from '@/lib/supabase/server';

export async function getFinancialTransactions() {
  const supabase = await createClient();
  
  // Fetch sales deals (money in)
  const { data: sales, error: salesError } = await supabase
    .from('sales_deals')
    .select('id, created_at, amount, vehicle_id')
    .order('created_at', { ascending: false })
    .limit(50);
  
  // Fetch vehicles for purchase info (money out)
  const { data: vehicles, error: vehiclesError } = await supabase
    .from('vehicles')
    .select('id, vin, year, make, model, purchase_price, extra_costs, created_at')
    .order('created_at', { ascending: false })
    .limit(50);
  
  const transactions: Array<{
    id: string;
    date: string;
    type: 'sale' | 'expense';
    description: string;
    amount: number;
  }> = [];
  
  // Add sales transactions
  if (sales && !salesError) {
    for (const sale of sales) {
      // Get vehicle info for description
      const vehicle = vehicles?.find(v => v.id === sale.vehicle_id);
      const description = vehicle 
        ? `${vehicle.year || ''} ${vehicle.make} ${vehicle.model} (VIN: ${vehicle.vin?.slice(-6) || 'N/A'})`
        : 'Vehicle Sale';
      
      transactions.push({
        id: sale.id,
        date: sale.created_at,
        type: 'sale',
        description,
        amount: parseFloat(sale.amount?.toString() || '0') || 0,
      });
    }
  }
  
  // Add purchase/expense transactions
  if (vehicles && !vehiclesError) {
    for (const vehicle of vehicles) {
      const purchasePrice = parseFloat(vehicle.purchase_price?.toString() || '0') || 0;
      const extraCosts = parseFloat(vehicle.extra_costs?.toString() || '0') || 0;
      const totalCost = purchasePrice + extraCosts;
      
      if (totalCost > 0) {
        transactions.push({
          id: `expense-${vehicle.id}`,
          date: vehicle.created_at,
          type: 'expense',
          description: `Vehicle Purchase: ${vehicle.make} ${vehicle.model}${vehicle.vin ? ` (${vehicle.vin.slice(-6)})` : ''}`,
          amount: totalCost,
        });
      }
    }
  }
  
  // Sort by date (most recent first)
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return transactions.slice(0, 50); // Return last 50 transactions
}
