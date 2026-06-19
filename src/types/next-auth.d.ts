import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      rolapp: "MASTER" | "USER"
    } & DefaultSession["user"]
  }

  interface User {
    rolapp: "MASTER" | "USER"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    rolapp: "MASTER" | "USER"
  }
}
