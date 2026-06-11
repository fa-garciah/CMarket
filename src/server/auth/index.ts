import NextAuth, { CredentialsSignin } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getUsersByEmail } from "@/server/services/userService"
import { authConfig } from "./authConfig"

class NoVerificadoError extends CredentialsSignin {
  code = "no-verificado"
}

export const { auth, signIn, signOut, handlers, unstable_update } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        correo: { label: "Correo", type: "email" },
        contrasena: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.correo || !credentials?.contrasena) return null

          const usuario = await getUsersByEmail(credentials.correo as string)
          if (!usuario) return null

          const passwordValida = await bcrypt.compare(
            credentials.contrasena as string,
            usuario.contrasena
          )
          if (!passwordValida) return null

          if (usuario.isactive === 0) {
            throw new NoVerificadoError()
          }

          return {
            id: String(usuario.idusuario),
            name: usuario.nombre,
            email: usuario.correo,
          }
        } catch (error) {
          if (error instanceof NoVerificadoError) throw error
          console.error("[authorize] Error al autenticar:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    session({ session, token }) {
      session.user.id = token.sub!
      return session
    }
  }
})