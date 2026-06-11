import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/login"
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user
    },
    async jwt({ token, trigger, session }) {
      if (trigger === "update" && session) {
        token.name = session.name
        token.telefono = session.telefono
      }
      return token
    },
    async session({ session, token }) {
      session.user.name = token.name as string
      return session
    }
  },
  session: {
    strategy: "jwt"
  }
}