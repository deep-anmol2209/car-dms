import {
  getTotalInventory,
  getInventoryByStatus,
  getVehiclesByMake,
  getAverageRetailPrice,
  getTotalInventoryValue,
  getVehiclesByYear,
} from "@/lib/services/inventry-service"

import { MetricResponseSchema } from "@/ai/schemas/tool-response-schema"

/* -------------------------------------------------------------------------- */
/*                               TOOL TYPES                                   */
/* -------------------------------------------------------------------------- */

export type InventoryTool =
  | "getTotalInventory"
  | "getInventoryByStatus"
  | "getVehiclesByMake"
  | "getAverageRetailPrice"
  | "getTotalInventoryValue"
  | "getVehiclesByYear"

/* -------------------------------------------------------------------------- */
/*                            TOOL REGISTRY                                   */
/* -------------------------------------------------------------------------- */

export const inventoryTools = {
  getTotalInventory: {
    name: "getTotalInventory",
    description: "Returns the total number of vehicles currently in inventory",
    parameters: {
      type: "object",
      properties: {},
    },
    execute: async (_args: any) => {
      const result = await getTotalInventory()
      return MetricResponseSchema.parse(result)
    },
  },

  getInventoryByStatus: {
    name: "getInventoryByStatus",
    description:
      "Returns inventory grouped by status such as available, sold, pending",
    parameters: {
      type: "object",
      properties: {},
    },
    execute: async () => {
      const result = await getInventoryByStatus()
      return MetricResponseSchema.parse(result)
    },
  },

  getVehiclesByMake: {
    name: "getVehiclesByMake",
    description:
      "Returns number of vehicles grouped by manufacturer (make)",
    parameters: {
      type: "object",
      properties: {},
    },
    execute: async () => {
      const result = await getVehiclesByMake()
      return MetricResponseSchema.parse(result)
    },
  },

  getAverageRetailPrice: {
    name: "getAverageRetailPrice",
    description:
      "Returns the average retail price of vehicles in inventory",
    parameters: {
      type: "object",
      properties: {},
    },
    execute: async () => {
      const result = await getAverageRetailPrice()
      return MetricResponseSchema.parse(result)
    },
  },

  getTotalInventoryValue: {
    name: "getTotalInventoryValue",
    description:
      "Returns the total monetary value of all vehicles in inventory based on retail price",
    parameters: {
      type: "object",
      properties: {},
    },
    execute: async () => {
      const result = await getTotalInventoryValue()
      return MetricResponseSchema.parse(result)
    },
  },

  getVehiclesByYear: {
    name: "getVehiclesByYear",
    description:
      "Returns number of vehicles grouped by manufacturing year",
    parameters: {
      type: "object",
      properties: {},
    },
    execute: async () => {
      const result = await getVehiclesByYear()
      return MetricResponseSchema.parse(result)
    },
  },
}

/* -------------------------------------------------------------------------- */
/*                       TOOL EXECUTION HELPER                                */
/* -------------------------------------------------------------------------- */

export async function executeInventoryTool(
  toolName: InventoryTool,
  args?: any
) {
  const tool = inventoryTools[toolName]

  if (!tool) {
    throw new Error(`Unknown tool: ${toolName}`)
  }

  return await tool.execute(args)
}