"use server"

import { createClient } from "@/lib/supabase/server"

/* -------------------------------------------------------------------------- */
/*                         TOTAL COMPLETED SALES                              */
/* -------------------------------------------------------------------------- */

export async function getTotalCompletedSales() {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from("sales_deals")
    .select("*", { count: "exact", head: true })
    .eq("deal_status", "Paid Off")

  if (error) {
    console.error("AI total sales error:", error)
    throw new Error("Failed to fetch total sales")
  }

  return {
    metric: "total_completed_sales",
    value: count ?? 0,
  }
}

/* -------------------------------------------------------------------------- */
/*                         TOTAL SALES REVENUE                                */
/* -------------------------------------------------------------------------- */

export async function getTotalSalesRevenue() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("sales_deals")
    .select("sale_price")
    .eq("deal_status", "Paid Off")

  if (error) throw error

  const revenue =
    data?.reduce(
      (sum, deal) => sum + (deal.sale_price || 0),
      0
    ) ?? 0

  return {
    metric: "total_sales_revenue",
    value: revenue,
  }
}

/* -------------------------------------------------------------------------- */
/*                         SALES THIS MONTH                                   */
/* -------------------------------------------------------------------------- */

export async function getSalesThisMonth() {
  const supabase = await createClient()

  const now = new Date()

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString()

  const { count, error } = await supabase
    .from("sales_deals")
    .select("*", { count: "exact", head: true })
    .eq("deal_status", "Paid Off")
    .gte("deal_date", startOfMonth)

  if (error) throw error
  console.log("count: ", count);
  

  return {
    metric: "sales_this_month",
    value: count ?? 0,
  }
}

/* -------------------------------------------------------------------------- */
/*                         REVENUE THIS MONTH                                 */
/* -------------------------------------------------------------------------- */

export async function getRevenueThisMonth() {
  const supabase = await createClient()

  const now = new Date()

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString()

  const { data, error } = await supabase
    .from("sales_deals")
    .select("sale_price")
    .eq("deal_status", "Paid Off")
    .gte("deal_date", startOfMonth)

  if (error) throw error

  const revenue =
    data?.reduce(
      (sum, deal) => sum + (deal.sale_price || 0),
      0
    ) ?? 0

  return {
    metric: "revenue_this_month",
    value: revenue,
  }
}

/* -------------------------------------------------------------------------- */
/*                         SALES BY STATUS                                    */
/* -------------------------------------------------------------------------- */

export async function getSalesDealsByStatus() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("sales_deals")
    .select("deal_status")

  if (error) throw error

  const stats: Record<string, number> = {}

  data?.forEach((deal) => {
    stats[deal.deal_status] = (stats[deal.deal_status] || 0) + 1
  })

  return {
    metric: "sales_deals_by_status",
    data: stats,
  }
}

/* -------------------------------------------------------------------------- */
/*                         REVENUE BY MONTH                                   */
/* -------------------------------------------------------------------------- */

export async function getRevenueByMonth() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("sales_deals")
    .select("sale_price, deal_date")
    .eq("deal_status", "Paid Off")

  if (error) throw error

  const stats: Record<string, number> = {}

  data?.forEach((deal) => {
    const month = new Date(deal.deal_date)
      .toISOString()
      .slice(0, 7)

    stats[month] =
      (stats[month] || 0) + (deal.sale_price || 0)
  })

  return {
    metric: "revenue_by_month",
    data: stats,
  }
}
export async function getTopSellingModel() {

    const supabase = await createClient()
  
    const { data, error } = await supabase
      .from("sales_deals")
      .select(`
        vehicles (
          model
        )
      `)
  
    if (error) throw error
  
    const counts: Record<string, number> = {}
  
    data?.forEach((sale: any) => {
      const model = sale.vehicles?.model
  
      if (!model) return
  
      counts[model] = (counts[model] || 0) + 1
    })
  
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  
    return {
      model: top?.[0] || null,
      sales: top?.[1] || 0,
    }
  }