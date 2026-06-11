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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Suspense>
                <Header nombreUsuario={session?.user?.name} />
            </Suspense>
            <Suspense>
                <Navbar />
            </Suspense>
            {children}
            <Footer />
        </div>
    )
}