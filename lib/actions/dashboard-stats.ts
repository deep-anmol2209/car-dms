'use server';

import { createClient } from '@/lib/supabase/server';

export async function getDashboardStats() {
  const supabase = await createClient();
  
  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);
  
  const nextMonthStart = new Date(currentMonthStart);
  nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);
  
  // Active inventory stats
  const { data: inventoryData, error: inventoryError } = await supabase
    .from('vehicles')
    .select('purchase_price, retail_price, extra_costs')
    .eq('status', 'Active');
  
  if (inventoryError) {
    console.error('Error fetching inventory:', inventoryError);
    return {
      total_inventory_count: 0,
      total_inventory_value: 0,
      projected_profit: 0,
      leads_this_month: 0,
    };
  }
  
  const total_inventory_count = inventoryData?.length || 0;
  const total_inventory_value = inventoryData?.reduce(
    (sum, v) => sum + (parseFloat(v.purchase_price?.toString() || '0') || 0), 0
  ) || 0;
  
  const projected_profit = inventoryData?.reduce(
    (sum, v) => {
      const retail = parseFloat(v.retail_price?.toString() || '0') || 0;
      const purchase = parseFloat(v.purchase_price?.toString() || '0') || 0;
      const extra = parseFloat(v.extra_costs?.toString() || '0') || 0;
      return sum + (retail - purchase - extra);
    }, 0
  ) || 0;
  
  // Leads this month
  const { count: leads_this_month, error: leadsError } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', currentMonthStart.toISOString())
    .lt('created_at', nextMonthStart.toISOString());
  
  if (leadsError) {
    console.error('Error fetching leads:', leadsError);
  }
  
  return {
    total_inventory_count,
    total_inventory_value,
    projected_profit,
    leads_this_month: leads_this_month || 0,
  };
}

export async function getInventoryStats() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('vehicles')
    .select('status');
  
  if (error) {
    console.error('Error fetching inventory stats:', error);
    return [
      { status: 'Active', count: 0 },
      { status: 'Sold', count: 0 },
      { status: 'Inactive', count: 0 },
    ];
  }
  
  const stats = data?.reduce((acc, vehicle) => {
    const status = vehicle.status || 'Inactive';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  
  return [
    { status: 'Active', count: stats['Active'] || 0 },
    { status: 'Sold', count: stats['Sold'] || 0 },
    { status: 'Inactive', count: stats['Inactive'] || 0 },
  ];
}

export async function getRevenueData() {
  const supabase = await createClient();
  
  // Fetch sales deals for revenue trend
  const { data, error } = await supabase
    .from('sales_deals')
    .select('created_at, amount')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching revenue data:', error);
    // Return sample data if no sales data exists
    return [
      { month: 'Jan', revenue: 0 },
      { month: 'Feb', revenue: 0 },
      { month: 'Mar', revenue: 0 },
      { month: 'Apr', revenue: 0 },
      { month: 'May', revenue: 0 },
      { month: 'Jun', revenue: 0 },
    ];
  }
  
  // Group by month
  const monthlyRevenue = data?.reduce((acc, deal) => {
    const date = new Date(deal.created_at);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
    const amount = parseFloat(deal.amount?.toString() || '0') || 0;
    acc[monthKey] = (acc[monthKey] || 0) + amount;
    return acc;
  }, {} as Record<string, number>) || {};
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const last6Months = months.slice(-6);
  
  return last6Months.map(month => ({
    month,
    revenue: monthlyRevenue[month] || 0,
  }));
}

export async function getRecentLeads(limit: number = 5) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('leads')
    .select(`
      id,
      status,
      created_at,
      customer:customers!inner(name, phone)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching recent leads:', error);
    return [];
  }
  
  // Transform data to match RecentLead interface
  return (data || []).map(lead => ({
    id: lead.id,
    status: lead.status,
    created_at: lead.created_at,
    customer: Array.isArray(lead.customer) && lead.customer.length > 0
      ? lead.customer[0]
      : (lead.customer as any) || undefined,
  }));
}
