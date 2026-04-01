"use server"

import { createClient } from "@/lib/supabase/server"

/* -------------------------------------------------------------------------- */
/*                              TOTAL INVENTORY                               */
/* -------------------------------------------------------------------------- */

export async function getTotalInventory() {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from("vehicles")
    .select("*", { count: "exact", head: true })

  if (error) {
    console.error("AI inventory count error:", error)
    throw new Error("Failed to fetch inventory count")
  }

  return {
    metric: "total_inventory",
    value: count ?? 0,
  }
}

/* -------------------------------------------------------------------------- */
/*                              INVENTORY BY STATUS                           */
/* -------------------------------------------------------------------------- */

export async function getInventoryByStatus() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("vehicles")
    .select("status")

  if (error) throw error

  const stats: Record<string, number> = {}

  data?.forEach((v) => {
    stats[v.status] = (stats[v.status] || 0) + 1
  })

  return {
    metric: "inventory_by_status",
    data: stats,
  }
}

/* -------------------------------------------------------------------------- */
/*                              VEHICLES BY MAKE                              */
/* -------------------------------------------------------------------------- */

export async function getVehiclesByMake() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("vehicles")
    .select("make")

  if (error) throw error

  const stats: Record<string, number> = {}

  data?.forEach((v) => {
    stats[v.make] = (stats[v.make] || 0) + 1
  })

  return {
    metric: "vehicles_by_make",
    data: stats,
  }
}

/* -------------------------------------------------------------------------- */
/*                           AVERAGE RETAIL PRICE                             */
/* -------------------------------------------------------------------------- */

export async function getAverageRetailPrice() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("vehicles")
    .select("retail_price")

  if (error) throw error

  const prices = data?.map((v) => v.retail_price || 0) ?? []

  const avg =
    prices.reduce((sum, p) => sum + p, 0) /
    (prices.length || 1)

  return {
    metric: "average_retail_price",
    value: avg,
  }
}

/* -------------------------------------------------------------------------- */
/*                              TOTAL INVENTORY VALUE                         */
/* -------------------------------------------------------------------------- */

export async function getTotalInventoryValue() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("vehicles")
    .select("retail_price")

  if (error) throw error

  const total =
    data?.reduce(
      (sum, v) => sum + (v.retail_price || 0),
      0
    ) ?? 0

  return {
    metric: "inventory_value",
    value: total,
  }
}

/* -------------------------------------------------------------------------- */
/*                              VEHICLES BY YEAR                              */
/* -------------------------------------------------------------------------- */

export async function getVehiclesByYear() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("vehicles")
    .select("year")

  if (error) throw error

  const stats: Record<string, number> = {}

  data?.forEach((v) => {
    const year = String(v.year)
    stats[year] = (stats[year] || 0) + 1
  })

  return {
    metric: "vehicles_by_year",
    data: stats,
  }
}

export async function getInventoryInsights() {
  const supabase = await createClient()

  /* -------------------------- STOCK DATA -------------------------- */

  const { data: vehicles, error: vehicleError } = await supabase
    .from("vehicles")
    .select("model, created_at")

  if (vehicleError) throw vehicleError

  /* -------------------------- SALES DATA -------------------------- */

  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString()

  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString()

  const { data: sales, error: salesError } = await supabase
    .from("sales_deals")
    .select(`
      deal_date,
      vehicles (
        model
      )
    `)
    .eq("deal_status", "Paid Off")

  if (salesError) throw salesError

  /* -------------------------- AGGREGATION -------------------------- */

  const stockMap: Record<string, number> = {}
  const lastRestockMap: Record<string, Date> = {}

  vehicles?.forEach((v) => {
    const model = v.model

    stockMap[model] = (stockMap[model] || 0) + 1

    const created = new Date(v.created_at)
    if (!lastRestockMap[model] || created > lastRestockMap[model]) {
      lastRestockMap[model] = created
    }
  })

  const sales7Map: Record<string, number> = {}
  const sales30Map: Record<string, number> = {}

  sales?.forEach((s: any) => {
    const model = s.vehicles?.model
    if (!model) return

    const date = new Date(s.deal_date)

    if (date >= new Date(sevenDaysAgo)) {
      sales7Map[model] = (sales7Map[model] || 0) + 1
    }

    if (date >= new Date(thirtyDaysAgo)) {
      sales30Map[model] = (sales30Map[model] || 0) + 1
    }
  })

  /* -------------------------- FINAL STRUCTURE -------------------------- */

  const models = Object.keys(stockMap)

  const insights = models.map((model) => {
    const stock = stockMap[model] || 0
    const sales7 = sales7Map[model] || 0
    const sales30 = sales30Map[model] || 0

    const avgDailySales = sales30 / 30

    const lastRestockDate = lastRestockMap[model]
    const daysSinceRestock = lastRestockDate
      ? Math.floor(
          (Date.now() - lastRestockDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null

    return {
      model,
      currentStock: stock,
      salesLast7Days: sales7,
      salesLast30Days: sales30,
      avgDailySales: Number(avgDailySales.toFixed(2)),
      lastRestockedDaysAgo: daysSinceRestock,
    }
  })

  /* -------------------------- FILTER (IMPORTANT) -------------------------- */

  return insights.filter(
    (car) =>
      car.currentStock < 5 || car.salesLast7Days > 2
  )
}