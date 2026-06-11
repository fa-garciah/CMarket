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
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <ul className="flex gap-8 justify-start md:justify-center overflow-x-auto scrollbar-hide">
        {CATEGORIAS.map(cat => (
          <li
            key={cat}
            onClick={() => handleCategoria(cat)}
            className={`cursor-pointer uppercase tracking-wide text-xs font-semibold transition-colors whitespace-nowrap
              ${activeCategory === cat
                ? "text-[#FF6B00] border-b-2 border-[#FF6B00] pb-1"
                : "text-gray-500 hover:text-[#FF6B00]"
              }`}
          >
            {cat}
          </li>
        ))}
      </ul>
    </nav>
  )
}