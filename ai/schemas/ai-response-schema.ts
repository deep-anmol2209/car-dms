import { z } from "zod"

export const AIResponseSchema = z.object({
  answer: z.string().min(1),
})

export type AIResponse = z.infer<typeof AIResponseSchema>