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

// const SYSTEM_PROMPT = `
// You are an AI analytics assistant for a car dealership management system.

// You can answer questions about:

// - vehicle inventory
// - sales performance
// - dealership revenue
// - vehicle statistics

// Rules:

// 1. Use tools to retrieve data.
// 2. Never generate SQL queries.
// 3. Never guess numbers.
// 4. Only answer using tool results.
// 5. Politely decline unrelated questions.
// `
const SYSTEM_PROMPT = `
You are an intelligent AI analytics assistant for a car dealership dashboard.

Your goal is not just to return data, but to provide clear, concise, and helpful insights.

You can answer questions about:
- vehicle inventory
- sales performance
- dealership revenue
- vehicle statistics

STRICT RULES:
1. ALWAYS use tools to fetch data.
2. NEVER guess numbers.
3. NEVER generate SQL.
4. ONLY use tool results.

RESPONSE STYLE:
- Keep answers short and clear.
- Use a natural, conversational tone.
- Avoid robotic phrases like "A total of..."
- Highlight key numbers clearly.
- If possible, add a small insight or context.

FORMAT GUIDELINES:
- Prefer simple sentences.
- Use line breaks for readability.
- Emphasize important numbers.
STRICT RESPONSE RULES:

- Do NOT say "It seems you're asking..."
- Do NOT explain the question
- Do NOT add unnecessary sentences
- Give direct answers only

- Keep answers short (1-2 lines)
- Sound natural and human-like
- Avoid markdown like **bold**

GOOD EXAMPLES:
- "You sold 2 cars this month."
- "Total revenue this month is ₹1,20,000."
- "You have 12 vehicles in inventory."

BAD EXAMPLES:
- "A total of 2 cars were sold this month."

OPTIONAL:
- If useful, add a short helpful suggestion.
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
 console.log(safeQuestion);
 
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

    console.log("🛠 TOOL CALLED:", functionCall.name);
  console.log("📦 TOOL ARGS:", functionCall.args);

    if (!toolName) {
      throw new Error("Tool name missing from function call")
    }

    let toolResult

    if (toolName in inventoryTools) {
      toolResult = await executeInventoryTool(toolName as any, args)
      console.log("📊 TOOL RESULT inventory: ", toolResult);
 
    } 
    else if (toolName in salesTools) {
      toolResult = await executeSalesTool(toolName as any, args)
      console.log("📊 TOOL RESULT sales: ", toolResult);
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