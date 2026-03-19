// import { NextResponse } from "next/server"
// import { analyticsAgent } from "@/ai/agents/agent"

// /* -------------------------------------------------------------------------- */
// /*                                POST API                                    */
// /* -------------------------------------------------------------------------- */

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()

//     const question = body?.question

//     if (!question || typeof question !== "string") {
//       return NextResponse.json(
//         { error: "Question is required" },
//         { status: 400 }
//       )
//     }

//     /* ---------------------------- RUN AGENT ---------------------------- */

//     const answer = await analyticsAgent(question)

//     /* ----------------------------- RESPONSE ---------------------------- */

//     return NextResponse.json({
//       success: true,
//       answer,
//     })
//   } catch (error) {
//     console.error("AI reports error:", error)

//     return NextResponse.json(
//       {
//         success: false,
//         error: "Failed to process AI request",
//       },
//       { status: 500 }
//     )
//   }
// }

import { GuardrailError } from "@/ai/guardrails/error"
import { analyticsAgent } from "@/ai/agents/agent"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { question } = await req.json()

    const answer = await analyticsAgent(question)

    return NextResponse.json({ success: true, answer })

  } catch (error: any) {

    if (error instanceof GuardrailError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      )
    }

    console.error(error)

    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    )
  }
}