"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect, useTransition } from "react"
import { Search } from "lucide-react"

type Props = {
  categorias: string[]
  currentSearch?: string
  currentCategory?: string
  placeholder?: string
}

export default function SearchFilter({
  categorias,
  currentSearch = "",
  currentCategory = "",
  placeholder = "Buscar productos...",
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()
  const [search, setSearch] = useState(currentSearch)
  const [category, setCategory] = useState(currentCategory)

  useEffect(() => { setSearch(currentSearch) }, [currentSearch])
  useEffect(() => { setCategory(currentCategory) }, [currentCategory])

  const update = (newSearch: string, newCategory: string) => {
    const next = new URLSearchParams()
    if (newSearch) next.set("search", newSearch)
    if (newCategory) next.set("category", newCategory)
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`)
    })
  }

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          placeholder={placeholder}
          onChange={(e) => { setSearch(e.target.value); update(e.target.value, category) }}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-800 shadow-sm outline-none placeholder:text-gray-400 focus:border-violet-400"
        />
      </div>
      {categorias.length > 0 && (
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); update(search, e.target.value) }}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm outline-none focus:border-violet-400"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      )}
    </div>
  )
}
