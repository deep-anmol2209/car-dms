import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Get existing active sales deal OR create a new one
 * Active = not Cancelled and not Paid Off
 */
export async function getOrCreateSalesDeal({
  supabase,
  customerId,
  vehicleId,
  salePrice = 0,
  salesperson_id,
}: {
  supabase: SupabaseClient;
  customerId: string;
  vehicleId?: string | null;
  salePrice?: number;
  salesperson_id?: string ;
}): Promise<string | null> {
  if (!vehicleId) return null;

  /* ------------------------------------------------------------
     1. Check for existing ACTIVE deal
     ------------------------------------------------------------ */
  const { data: existingDeal, error: fetchError } = await supabase
    .from('sales_deals')
    .select('id')
    .eq('customer_id', customerId)
    .eq('vehicle_id', vehicleId)
    .not('deal_status', 'in', '("Cancelled","Paid Off")')
    .maybeSingle();

  if (fetchError) {
    console.error('[GET_SALES_DEAL]', fetchError);
    throw new Error('Failed to fetch sales deal');
  }

  if (existingDeal) {
    return existingDeal.id;
  }

  /* ------------------------------------------------------------
     2. Create new sales deal
     ------------------------------------------------------------ */
  const { data: newDeal, error: insertError } = await supabase
    .from('sales_deals')
    .insert({
      customer_id: customerId,
      vehicle_id: vehicleId,
      deal_status: 'Negotiation',
      sale_price: salePrice,   // can be updated later
      paid_amount: 0,
      salesperson_id: salesperson_id,
      deal_date: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('[CREATE_SALES_DEAL]', insertError);
    throw new Error('Failed to create sales deal');
  }

  return newDeal.id;
}
