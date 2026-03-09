// File: app/api/upload-auth/route.ts

import { getUploadAuthParams } from "@imagekit/next/server"
import crypto from "crypto"

export async function GET() {
  try {
    const token = crypto.randomUUID(); // ✅ always unique
    const expire = Math.floor(Date.now() / 1000) + 60 * 5; // 5 minutes expiry

    const { signature } = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
      token,
      expire,
    })

    return Response.json({
      token,
      expire,
      signature,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    })
  } catch (error) {
    console.error("Error generating upload authentication parameters:", error)

    return Response.json(
      { error: "Failed to generate upload authentication parameters" },
      { status: 500 }
    )
  }
}
