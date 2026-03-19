/* -------------------------------------------------------------------------- */
/*                             OUTPUT GUARDRAILS                              */
/* -------------------------------------------------------------------------- */

const MAX_OUTPUT_LENGTH = 2000

/* -------------------------------------------------------------------------- */
/*                       SENSITIVE / INTERNAL PATTERNS                        */
/* -------------------------------------------------------------------------- */

const SENSITIVE_PATTERNS = [
  "api key",
  "secret",
  "token",
  "password",
  "private key",
  "environment variable",
  "system prompt",
  "internal instruction",
  "database schema",
  "supabase url",
  "service role key",
]

/* -------------------------------------------------------------------------- */
/*                             OUTPUT SANITIZER                               */
/* -------------------------------------------------------------------------- */

export function sanitizeOutput(output: any): string {

  if (!output) {
    return "No data available."
  }

  /* ---------------------- NORMALIZE OUTPUT ---------------------- */

  let text =
    typeof output === "string"
      ? output
      : JSON.stringify(output)

  const lower = text.toLowerCase()

  /* ---------------------- BLOCK SENSITIVE CONTENT ---------------------- */

  for (const pattern of SENSITIVE_PATTERNS) {
    if (lower.includes(pattern)) {
      return "Response blocked due to sensitive content."
    }
  }

  /* ---------------------- PREVENT RAW JSON DUMPS ---------------------- */

  try {
    const parsed = JSON.parse(text)

    if (typeof parsed === "object") {
      return "I retrieved the requested data, but the response format needs to be summarized for readability."
    }
  } catch {
    // not JSON — continue
  }

  /* ---------------------- LENGTH LIMIT ---------------------- */

  if (text.length > MAX_OUTPUT_LENGTH) {
    text = text.slice(0, MAX_OUTPUT_LENGTH) + "..."
  }

  /* ---------------------- CLEAN EXTRA WHITESPACE ---------------------- */

  text = text.trim()

  return text
}