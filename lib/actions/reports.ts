'use server';

import { createClient } from '@/lib/supabase/server';

/* =========================
   SALES REPORT
========================= */

export async function getSalesReport() {
  const supabase = await createClient();

  const { data: deals, error } = await supabase
    .from('sales_deals')
    .select('id, sale_price, created_at');

  if (error) throw error;

  const totalRevenue =
    deals?.reduce((sum, deal) => sum + (deal.sale_price || 0), 0) || 0;

  const totalDeals = deals?.length || 0;

  const avgDealValue = totalDeals ? totalRevenue / totalDeals : 0;

  return {
    totalRevenue,
    totalDeals,
    avgDealValue,
    deals,
  };
}

/* =========================
   INVENTORY REPORT
========================= */

export async function getInventoryReport() {
  const supabase = await createClient();

  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('id, model, status, created_at');

  if (error) throw error;

  const totalStock = vehicles?.length || 0;

  const soldVehicles =
    vehicles?.filter((v) => v.status === 'sold').length || 0;

  const unsoldVehicles =
    vehicles?.filter((v) => v.status !== 'sold').length || 0;

  return {
    totalStock,
    soldVehicles,
    unsoldVehicles,
    vehicles,
  };
}

/* =========================
   LEADS REPORT
========================= */

export async function getLeadsReport() {
  const supabase = await createClient();

  const { data: leads, error } = await supabase
    .from('leads')
    .select('id, status, source, created_at');

  if (error) throw error;

  const totalLeads = leads?.length || 0;

  const converted =
    leads?.filter((l) => l.status === 'converted').length || 0;

  const lost =
    leads?.filter((l) => l.status === 'lost').length || 0;

  const conversionRate = totalLeads
    ? ((converted / totalLeads) * 100).toFixed(2)
    : 0;

  return {
    totalLeads,
    converted,
    lost,
    conversionRate,
    leads,
  };
}

/* =========================
   FINANCIAL REPORT
========================= */

export async function getFinancialReport() {
  const supabase = await createClient();

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('id, total, created_at');

  if (error) throw error;

  const revenue =
    invoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;

  return {
    revenue,
    invoices,
  };
}