import {
    getTotalCompletedSales,
    getTotalSalesRevenue,
    getSalesThisMonth,
    getRevenueThisMonth,
    getSalesDealsByStatus,
    getRevenueByMonth,
    getTopSellingModel,
  } from "@/lib/services/sales-service"
  
  /* -------------------------------------------------------------------------- */
  /*                               TOOL TYPES                                   */
  /* -------------------------------------------------------------------------- */
  
  export type SalesTool =
    | "getTotalCompletedSales"
    | "getTotalSalesRevenue"
    | "getSalesThisMonth"
    | "getRevenueThisMonth"
    | "getSalesDealsByStatus"
    | "getRevenueByMonth"
  
  /* -------------------------------------------------------------------------- */
  /*                            TOOL REGISTRY                                   */
  /* -------------------------------------------------------------------------- */
  
  export const salesTools = {
    getTotalCompletedSales: {
      name: "getTotalCompletedSales",
      description:
        "Returns the total number of completed vehicle sales",
      parameters: {},
      execute: async (_args: any) => {
        return await getTotalCompletedSales()
      },
    },
  
    getTotalSalesRevenue: {
      name: "getTotalSalesRevenue",
      description:
        "Returns the total revenue generated from all completed sales",
      parameters: {},
      execute: async () => {
        return await getTotalSalesRevenue()
      },
    },
  
    getSalesThisMonth: {
      name: "getSalesThisMonth",
      description:
        "Returns the total number of vehicles sold in the current month",
      parameters: {},
      execute: async () => {
        return await getSalesThisMonth()
      },
    },
  
    getRevenueThisMonth: {
      name: "getRevenueThisMonth",
      description:
        "Returns the revenue generated from vehicle sales this month",
      parameters: {},
      execute: async () => {
        return await getRevenueThisMonth()
      },
    },
  
    getSalesDealsByStatus: {
      name: "getSalesDealsByStatus",
      description:
        "Returns sales deals grouped by status such as Negotiation, Paid Off, or Cancelled",
      parameters: {},
      execute: async () => {
        return await getSalesDealsByStatus()
      },
    },
  
    getRevenueByMonth: {
      name: "getRevenueByMonth",
      description:
        "Returns monthly revenue trend from vehicle sales",
      parameters: {},
      execute: async () => {
        return await getRevenueByMonth()
      },
    },

    getTopSellingModel: {
        name: "getTopSellingModel",
        description: "Returns the car model with the highest number of completed sales",
        parameters: {},
        execute: async ()=>{
            return await getTopSellingModel()
        }
      }
  }
  
  /* -------------------------------------------------------------------------- */
  /*                       TOOL EXECUTION HELPER                                */
  /* -------------------------------------------------------------------------- */
  
  export async function executeSalesTool(
    toolName: SalesTool,
    args?: any
  ) {
    const tool = salesTools[toolName]
  
    if (!tool) {
      throw new Error(`Unknown tool: ${toolName}`)
    }
  
    return await tool.execute(args)
  }