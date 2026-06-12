"use client"
import { useRouter, useSearchParams } from "next/navigation"

const CATEGORIAS = ["Todos", "Comida", "Eventos", "Tecnología", "Hogar", "Servicios", "Ropa", "Otros"]

export default function Navbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category") ?? "Todos"

  function handleCategoria(categoria: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (categoria === "Todos") {
      params.delete("category")
    } else {
      params.set("category", categoria)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <nav className="border-b border-white/10 bg-[#231f39]/80 px-6 py-4 shadow-[0_8px_30px_rgba(10,10,30,0.22)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto pb-1">
        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoria(cat)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] whitespace-nowrap transition-all
              ${activeCategory === cat
                ? "border-indigo-300/70 bg-indigo-400/15 text-indigo-100 shadow-[0_12px_30px_rgba(129,140,248,0.18)]"
                : "border-white/10 bg-white/6 text-slate-200 hover:border-indigo-300/60 hover:bg-white/10 hover:text-white"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </nav>
  )
}