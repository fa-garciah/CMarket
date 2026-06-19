import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import MasterSidebar from "@/features/master/components/MasterSidebar"

export default async function MasterLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session || session.user.rolapp !== "MASTER") {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-900">
      <MasterSidebar nombre={session.user.name ?? ""} />
      <main className="flex-1 overflow-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}
