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