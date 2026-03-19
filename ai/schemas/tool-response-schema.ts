import { z } from "zod"

export const MetricResponseSchema = z.object({
  metric: z.string(),
  value: z.number().optional(),
  data: z.record(z.number()).optional(),
})