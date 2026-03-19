/* -------------------------------------------------------------------------- */
/*                              INPUT GUARDRAILS                              */
/* -------------------------------------------------------------------------- */

import { GuardrailError } from "./error"

const MAX_INPUT_LENGTH = 500

/* -------------------------------------------------------------------------- */
/*                           BLOCKED PROMPT PATTERNS                          */
/* -------------------------------------------------------------------------- */

const BLOCKED_PATTERNS = [
  "ignore previous instructions",
  "reveal system prompt",
  "show system prompt",
  "delete database",
  "drop table",
  "drop database",
  "update database",
  "truncate",
  "shutdown server",
  "access environment variables",
  "show secrets",
  "api key",
  "private key",
  "password",
]

/* -------------------------------------------------------------------------- */
/*                          ALLOWED ANALYTICS TOPICS                          */
/* -------------------------------------------------------------------------- */

const ALLOWED_TOPICS = [
  /* inventory */
  "inventory",
  "vehicle",
  "vehicles",
  "car",
  "cars",
  "make",
  "model",
  "year",
  "price",
  "inventory value",
  "status",

  /* sales */
  "sale",
  "sales",
  "sold",
  "deal",
  "deals",
  "revenue",
  "income",
  "profit",
  "month",
  "monthly",
]

/* -------------------------------------------------------------------------- */
/*                             INPUT VALIDATION                               */
/* -------------------------------------------------------------------------- */

export function validateInput(question: string): string {

  if (!question || typeof question !== "string") {
    throw new GuardrailError(
      "Please enter a valid question."
    )
  }

  const cleaned = question.trim()

  /* --------------------------- LENGTH LIMIT --------------------------- */

  if (cleaned.length > MAX_INPUT_LENGTH) {
    throw new GuardrailError(
      "Your question is too long. Please keep it under 500 characters."
    )
  }

  const lower = cleaned.toLowerCase()

  /* ------------------------- BLOCKED PATTERNS ------------------------- */

  for (const pattern of BLOCKED_PATTERNS) {
    if (lower.includes(pattern)) {
      throw new GuardrailError(
        "Your request cannot be processed due to security restrictions.",
        403
      )
    }
  }

  /* ------------------------ TOPIC RESTRICTION ------------------------- */

  const isRelevant = ALLOWED_TOPICS.some((topic) =>
    lower.includes(topic)
  )

  if (!isRelevant) {
    throw new GuardrailError(
      "I can only answer questions about dealership analytics such as inventory, vehicle statistics, or sales performance."
    )
  }

  return cleaned
}