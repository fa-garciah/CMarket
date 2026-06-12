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
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#231f39]/90 px-6 py-3 shadow-[0_18px_45px_rgba(10,10,30,0.35)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-white shadow-[0_8px_25px_rgba(15,23,42,0.20)] transition hover:bg-white/10"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400 text-sm font-black text-slate-950 shadow-[0_10px_30px_rgba(129,140,248,0.35)]">C</span>
            <span>
              <span className="block text-base font-black tracking-[0.24em]">CMARKET</span>
              <span className="text-[11px] uppercase tracking-[0.28em] text-indigo-100/80">Marketplace</span>
            </span>
          </button>

          <div className="hidden flex-1 items-center justify-end md:flex">
            <div className="flex w-full max-w-xl items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.25)] backdrop-blur-md">
              <Search className="h-4 w-4 text-indigo-100/80" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Buscar productos en la Anáhuac..."
                className="flex-grow text-sm text-white outline-none placeholder:text-slate-300/80"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="rounded-full border border-white/10 bg-white/8 p-2 text-white transition hover:bg-white/12 md:hidden"
            >
              <Search className="h-5 w-5" />
            </button>

            <button onClick={() => router.push("/")} title="Inicio" className="rounded-full border border-white/10 bg-white/8 p-2 text-white transition hover:bg-white/12">
              <Home className="h-5 w-5" />
            </button>
            <button onClick={() => router.push("/profile")} title="Perfil" className="rounded-full border border-white/10 bg-white/8 p-2 text-white transition hover:bg-white/12">
              <User className="h-5 w-5" />
            </button>
            <button onClick={() => signOut({ callbackUrl: "/login" })} title="Cerrar sesión" className="rounded-full border border-white/10 bg-white/8 p-2 text-white transition hover:bg-white/12">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {mobileSearchOpen && (
        <div className="sticky top-[61px] z-10 border-b border-white/10 bg-[#231f39]/95 px-4 pb-3 pt-2 shadow-[0_18px_45px_rgba(10,10,30,0.35)] backdrop-blur-xl md:hidden">
          <div className="mx-auto flex w-full max-w-sm items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.25)]">
            <Search className="h-4 w-4 text-indigo-100/80 shrink-0" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Buscar productos..."
              className="flex-grow text-sm text-white outline-none placeholder:text-slate-300/80"
              autoFocus
            />
            <button onClick={() => setMobileSearchOpen(false)}>
              <X className="h-4 w-4 text-gray-200 shrink-0" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}