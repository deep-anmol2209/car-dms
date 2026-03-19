"use server"

import { GoogleGenAI, Type } from "@google/genai"

import {
  inventoryTools,
  executeInventoryTool,
} from "@/ai/inventory-tools"

import {
  salesTools,
  executeSalesTool,
} from "@/ai/sale-tools"

import { validateInput } from "@/ai/guardrails/input-guardrails"
import { sanitizeOutput } from "@/ai/guardrails/outputguardrails"

import { AIResponseSchema } from "@/ai/schemas/ai-response-schema"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
})

const MODEL = "gemini-2.5-flash"

/* -------------------------------------------------------------------------- */
/*                              SYSTEM PROMPT                                 */
/* -------------------------------------------------------------------------- */

const SYSTEM_PROMPT = `
You are an AI analytics assistant for a car dealership management system.

You can answer questions about:

- vehicle inventory
- sales performance
- dealership revenue
- vehicle statistics

Rules:

1. Use tools to retrieve data.
2. Never generate SQL queries.
3. Never guess numbers.
4. Only answer using tool results.
5. Politely decline unrelated questions.
`

/* -------------------------------------------------------------------------- */
/*                        MERGE ALL TOOL DECLARATIONS                         */
/* -------------------------------------------------------------------------- */

const allTools = [
  ...Object.values(inventoryTools),
  ...Object.values(salesTools),
]

/* -------------------------------------------------------------------------- */
/*                              AGENT FUNCTION                                */
/* -------------------------------------------------------------------------- */

export async function analyticsAgent(question: string) {

  const normalized = question.toLowerCase().trim()

  const GREETINGS = ["hi", "hello", "hey", "good morning", "good evening"]

  const HELP_MESSAGES = [
    "how can you help",
    "what can you do",
    "help",
  ]

  /* ---------------------- GREETING HANDLER ---------------------- */

  if (GREETINGS.includes(normalized)) {
    return `Hello! 👋

I can help you analyze your dealership data.

Try asking:
• How many vehicles are in inventory?
• Which make has the most cars?
• How many cars sold this month?
• What is the total revenue this month?`
  }

  /* ---------------------- HELP HANDLER ---------------------- */

  if (HELP_MESSAGES.some((msg) => normalized.includes(msg))) {
    return `I can analyze your dealership data.

Examples:
• How many vehicles are currently in inventory?
• Which make has the most cars?
• How many cars sold this month?
• What is the total sales revenue?
• Show vehicles by year`
  }

  /* --------------------------- INPUT GUARD --------------------------- */

  const safeQuestion = validateInput(question)

  /* -------------------------- MODEL REQUEST -------------------------- */

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `${SYSTEM_PROMPT}\n\nUser Question: ${safeQuestion}`,
    config: {
      tools: [
        {
          functionDeclarations: allTools.map((tool) => ({
            name: tool.name,
            description: tool.description,
            parameters: {
              type: Type.OBJECT,
              properties: {},
            }
          })),
        },
      ],
    },
  })

  /* --------------------------- TOOL CALL CHECK ---------------------------- */

  if (response.functionCalls && response.functionCalls.length > 0) {

    const functionCall = response.functionCalls[0]

    const toolName = functionCall?.name
    const args = functionCall?.args || {}

    if (!toolName) {
      throw new Error("Tool name missing from function call")
    }

    let toolResult

    if (toolName in inventoryTools) {
      toolResult = await executeInventoryTool(toolName as any, args)
    } 
    else if (toolName in salesTools) {
      toolResult = await executeSalesTool(toolName as any, args)
    } 
    else {
      throw new Error(`Unknown tool: ${toolName}`)
    }

    /* ---------------- SEND TOOL RESULT BACK ---------------- */

    const finalResponse = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [{ text: safeQuestion }],
        },
        {
          role: "model",
          parts: [
            {
              functionCall: {
                name: toolName,
                args,
              },
            },
          ],
        },
        {
          role: "tool",
          parts: [
            {
              functionResponse: {
                name: toolName,
                response: toolResult,
              },
            },
          ],
        },
      ],
    })

    const cleaned = sanitizeOutput(finalResponse.text)

    /* ---------------- ZOD VALIDATION ---------------- */

    const validated = AIResponseSchema.parse({
      answer: cleaned,
    })

    return validated.answer
  }

  /* ------------------------ NO TOOL USED -------------------------------- */

  const cleaned = sanitizeOutput(response.text)

  const validated = AIResponseSchema.parse({
    answer: cleaned,
  })

  return validated.answer
}