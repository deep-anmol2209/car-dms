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

export async function getRestockDecision(data: any) {
  const prompt = `
You are an inventory decision system.

Input:
${JSON.stringify(data)}

Rules:
- If stock < 3 AND sales > 5 → HIGH priority restock
- If stock < 3 → MEDIUM
- Else → IGNORE

Return ONLY JSON:
{
  "action": "RESTOCK" | "IGNORE",
  "priority": "HIGH" | "MEDIUM" | "LOW",
  "recommendedQty": number,
  "reason": string
}
`

const res = await ai.models.generateContent({
  model: "gemini-1.5-flash",
  contents: prompt,
})

const text = res.text

if (!text) {
  throw new Error("AI returned empty response")
}

try {
  return JSON.parse(cleanJSON(text))
} catch (err) {
  console.error("Invalid AI JSON:", text)
  throw new Error("Failed to parse AI response")
}
  
}