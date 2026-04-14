"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"

/* -------------------------------------------------------------------------- */
/*                              TOTAL INVENTORY                               */
/* -------------------------------------------------------------------------- */

export async function getTotalInventory() {
  const supabase =  supabaseAdmin

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
     type: "count",
  unit: "vehicles"
  }
}

/* -------------------------------------------------------------------------- */
/*                              INVENTORY BY STATUS                           */
/* -------------------------------------------------------------------------- */

export async function getInventoryByStatus() {
  const supabase = supabaseAdmin
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
  type: "distribution"
  }
}

/* -------------------------------------------------------------------------- */
/*                              VEHICLES BY MAKE                              */
/* -------------------------------------------------------------------------- */

export async function getVehiclesByMake() {
  const supabase = supabaseAdmin
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
  type: "distribution"
  }
}

/* -------------------------------------------------------------------------- */
/*                           AVERAGE RETAIL PRICE                             */
/* -------------------------------------------------------------------------- */

export async function getAverageRetailPrice() {
  const supabase = supabaseAdmin
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
    type: "currency",
  currency: "INR"
  }
}

/* -------------------------------------------------------------------------- */
/*                              TOTAL INVENTORY VALUE                         */
/* -------------------------------------------------------------------------- */

export async function getTotalInventoryValue() {
  const supabase = supabaseAdmin
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
    type: "currency",
  currency: "INR"
  }
}

/* -------------------------------------------------------------------------- */
/*                              VEHICLES BY YEAR                              */
/* -------------------------------------------------------------------------- */

export async function getVehiclesByYear() {
  const supabase = supabaseAdmin
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
  type: "distribution"
  }
}

// export async function getInventoryInsights() {
//   const supabase = supabaseAdmin
//   /* -------------------------- STOCK DATA -------------------------- */

//   const { data: vehicles, error: vehicleError } = await supabase
//     .from("vehicles")
//     .select("model, created_at")

//   if (vehicleError) throw vehicleError

//   /* -------------------------- SALES DATA -------------------------- */

//   const sevenDaysAgo = new Date(
//     Date.now() - 7 * 24 * 60 * 60 * 1000
//   ).toISOString()

//   const thirtyDaysAgo = new Date(
//     Date.now() - 30 * 24 * 60 * 60 * 1000
//   ).toISOString()

//   const { data: sales, error: salesError } = await supabase
//     .from("sales_deals")
//     .select(`
//       deal_date,
//       vehicles (
//         model
//       )
//     `)
//     .eq("deal_status", "Paid Off")

//   if (salesError) throw salesError

//   /* -------------------------- AGGREGATION -------------------------- */

//   const stockMap: Record<string, number> = {}
//   const lastRestockMap: Record<string, Date> = {}

//   vehicles?.forEach((v) => {
//     const model = v.model

//     stockMap[model] = (stockMap[model] || 0) + 1

//     const created = new Date(v.created_at)
//     if (!lastRestockMap[model] || created > lastRestockMap[model]) {
//       lastRestockMap[model] = created
//     }
//   })

//   const sales7Map: Record<string, number> = {}
//   const sales30Map: Record<string, number> = {}

//   sales?.forEach((s: any) => {
//     const model = s.vehicles?.model
//     if (!model) return

//     const date = new Date(s.deal_date)

//     if (date >= new Date(sevenDaysAgo)) {
//       sales7Map[model] = (sales7Map[model] || 0) + 1
//     }

//     if (date >= new Date(thirtyDaysAgo)) {
//       sales30Map[model] = (sales30Map[model] || 0) + 1
//     }
//   })

//   /* -------------------------- FINAL STRUCTURE -------------------------- */

//   const models = Object.keys(stockMap)

//   const insights = models.map((model) => {
//     const stock = stockMap[model] || 0
//     const sales7 = sales7Map[model] || 0
//     const sales30 = sales30Map[model] || 0

//     const avgDailySales = sales30 / 30

//     const lastRestockDate = lastRestockMap[model]
//     const daysSinceRestock = lastRestockDate
//       ? Math.floor(
//           (Date.now() - lastRestockDate.getTime()) /
//             (1000 * 60 * 60 * 24)
//         )
//       : null

//     return {
//       model,
//       currentStock: stock,
//       salesLast7Days: sales7,
//       salesLast30Days: sales30,
//       avgDailySales: Number(avgDailySales.toFixed(2)),
//       lastRestockedDaysAgo: daysSinceRestock,
//     }
//   })

//   /* -------------------------- FILTER (IMPORTANT) -------------------------- */

//   return insights.filter(
//     (car) =>
//       car.currentStock < 5 || car.salesLast7Days > 2
//   )
// }

export async function getInventoryInsights() {
  const supabase = supabaseAdmin

  /* -------------------------- TIME RANGES -------------------------- */

  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString()

  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString()

  /* -------------------------- STOCK DATA -------------------------- */

  const { data: vehicles, error: vehicleError } = await supabase
    .from("vehicles")
    .select("model, created_at")
    .eq("status","Active")

  if (vehicleError) throw vehicleError

  /* -------------------------- SALES (7 DAYS) -------------------------- */

  const { data: sales7, error: sales7Error } = await supabase
    .from("sales_deals")
    .select(`
      vehicles (
        model
      )
    `)
    .eq("deal_status", "Paid Off")
    .gte("deal_date", sevenDaysAgo)

  if (sales7Error) throw sales7Error

  /* -------------------------- SALES (30 DAYS) -------------------------- */

  const { data: sales30, error: sales30Error } = await supabase
    .from("sales_deals")
    .select(`
      vehicles (
        model
      )
    `)
    .eq("deal_status", "Paid Off")
    .gte("deal_date", thirtyDaysAgo)

  if (sales30Error) throw sales30Error

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

  /* -------------------------- COUNT 7 DAYS -------------------------- */

  sales7?.forEach((s: any) => {
    const model = s.vehicles?.model
    if (!model) return

    sales7Map[model] = (sales7Map[model] || 0) + 1
  })

  /* -------------------------- COUNT 30 DAYS -------------------------- */

  sales30?.forEach((s: any) => {
    const model = s.vehicles?.model
    if (!model) return

    sales30Map[model] = (sales30Map[model] || 0) + 1
  })

  /* -------------------------- FINAL STRUCTURE -------------------------- */

  const models = Object.keys(stockMap)

  const insights = models.map((model) => {
    const stock = stockMap[model] || 0
    const s7 = sales7Map[model] || 0
    const s30 = sales30Map[model] || 0

    const avgDailySales = s30 / 30

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
      salesLast7Days: s7,
      salesLast30Days: s30,
      avgDailySales: Number(avgDailySales.toFixed(2)),
      lastRestockedDaysAgo: daysSinceRestock,
    }
  })

  /* -------------------------- FILTER -------------------------- */

  return insights.filter(
    (car) =>
      car.currentStock < 5 || car.salesLast7Days > 2
  )
}