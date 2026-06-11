import NextAuth from "next-auth"
import { authConfig } from "@/server/auth/authConfig"

const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  matcher: [
    "/",
    "/agregar-producto",
    "/editar-perfil/:path*",
    "/products/:path*",
    "/profile",
  ],
}
