import NextAuth from "next-auth"
import { authConfig } from "@/server/auth/authConfig"

const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  matcher: [
    "/agregar-producto",
    "/agregar-producto/:path*",
    "/editar-perfil/:path*",
    "/products/:path*",
    "/profile",
    "/profile/:path*",
    "/mis-transacciones",
    "/mis-transacciones/:path*",
    "/mis-ventas",
    "/mis-ventas/:path*",
  ],
}
