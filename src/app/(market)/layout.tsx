import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import UserSidebar from "@/features/user/components/UserSidebar"

export default async function MarketLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 text-gray-900">
      <UserSidebar nombre={session.user.name ?? ""} userId={session.user.id} />
      <main className="relative flex-1 min-w-0 overflow-y-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  )
}
