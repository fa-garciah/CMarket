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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.rolapp = user.rolapp
      }
      if (trigger === "update" && session) {
        token.name = session.name
        token.telefono = session.telefono
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.sub!
      session.user.name = token.name as string
      session.user.rolapp = token.rolapp as "MASTER" | "USER"
      return session
    }
  },
  session: {
    strategy: "jwt"
  }
}