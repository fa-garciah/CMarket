import { auth } from "@/server/auth"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import { Suspense } from "react"

export default async function MarketLayout({
    children
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    return (
        <div className="min-h-screen flex flex-col bg-[radial-gradient(1200px_700px_at_20%_-10%,#8580a8_0%,#5c5878_45%,#44405b_100%)] text-slate-100">
            <div className="pointer-events-none fixed inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(15,23,42,0.35),transparent_42%)]" />
            <Suspense>
                <Header nombreUsuario={session?.user?.name} />
            </Suspense>
            <Suspense>
                <Navbar />
            </Suspense>
            <div className="relative flex-1">
                {children}
            </div>
            <Footer />
        </div>
    )
}