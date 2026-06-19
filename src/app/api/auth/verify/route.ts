import { NextRequest, NextResponse } from "next/server"
import { verifyEmail } from "@/server/services/userService"

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  const base = (process.env.NEXTAUTH_URL ?? process.env.AUTH_URL ?? req.nextUrl.origin).replace(/\/$/, "")

  if (!token) {
    return NextResponse.redirect(`${base}/login?error=token-invalido`)
  }

  const result = await verifyEmail(token)

  if ("error" in result) {
    return NextResponse.redirect(`${base}/login?error=${result.error}`)
  }

  return NextResponse.redirect(`${base}/login?verified=true`)
}