import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
})

function cleanJSON(text: string) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim()
}

/* -------------------------------------------------------------------------- */
/*                     BATCH RESTOCK DECISION (IMPORTANT)                      */
/* -------------------------------------------------------------------------- */

export async function getBatchRestockDecision(cars: any[]) {
  if (!cars.length) return []

  const prompt = `
You are an inventory decision system.

Input (array of cars):
${JSON.stringify(cars)}

Rules:
- If currentStock < 3 AND salesLast7Days > 5 → HIGH
- If currentStock < 3 → MEDIUM
- Else → IGNORE

Return ONLY JSON ARRAY:
[
  {
    "model": string,
    "action": "RESTOCK" | "IGNORE",
    "priority": "HIGH" | "MEDIUM" | "LOW",
    "recommendedQty": number,
    "reason": string
  }
]
`

  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  })

  const text = res.text

  if (!text) throw new Error("AI returned empty response")

  try {
    return JSON.parse(cleanJSON(text))
  } catch (err) {
    console.error("Invalid AI JSON:", text)
    throw new Error("Failed to parse AI response")
  }
}