"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { signOut } from "next-auth/react"
import { Search, Home, User, LogOut, X } from "lucide-react"

type Props = {
  nombreUsuario: string | null | undefined
}

export default function Header({ nombreUsuario }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [inputValue, setInputValue] = useState(searchParams.get("search") ?? "")
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  function handleSearch() {
    const params = new URLSearchParams(searchParams.toString())
    if (inputValue) {
      params.set("search", inputValue)
    } else {
      params.delete("search")
    }
    router.replace(`/?${params.toString()}`)
    setInputValue("")
    setMobileSearchOpen(false)
  }

  return (
    <>
      <header className="bg-[#FF6B00] px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <span className="text-white font-black text-xl tracking-tight">CMARKET</span>

        <div className="hidden md:flex items-center w-96 bg-white rounded-full px-4 py-2 gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Buscar productos en la Anáhuac..."
            className="flex-grow text-sm outline-none text-gray-700"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden text-white hover:text-orange-200 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>

          <button onClick={() => router.push("/")} title="Inicio" className="text-white hover:text-orange-200 transition-colors">
            <Home className="h-5 w-5" />
          </button>
          <button onClick={() => router.push("/profile")} title="Perfil" className="text-white hover:text-orange-200 transition-colors">
            <User className="h-5 w-5" />
          </button>
          <button onClick={() => signOut({ callbackUrl: "/login" })} title="Cerrar sesión" className="text-white hover:text-orange-200 transition-colors">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {mobileSearchOpen && (
        <div className="md:hidden bg-[#FF6B00] px-4 pb-3 pt-1 sticky top-13 z-10 flex justify-center">
          <div className="flex items-center bg-white rounded-full px-4 py-2 gap-2 w-full max-w-sm shadow-lg">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Buscar productos..."
              className="flex-grow text-sm outline-none text-gray-700"
              autoFocus
            />
            <button onClick={() => setMobileSearchOpen(false)}>
              <X className="h-4 w-4 text-gray-400 shrink-0" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}