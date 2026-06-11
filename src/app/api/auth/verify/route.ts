import { NextRequest, NextResponse } from "next/server"
import { verifyEmail } from "@/server/services/userService"

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=token-invalido", req.url))
  }

  const result = await verifyEmail(token)

  if ("error" in result) {
    return NextResponse.redirect(new URL(`/login?error=${result.error}`, req.url))
  }

  return NextResponse.redirect(new URL("/login?verified=true", req.url))
}