"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect, useTransition } from "react"

type Comunidad = { idcomunidad: number; nombre: string; slug: string }

type Props = {
  comunidades: Comunidad[]
  selected: string[]
  currentSearch?: string
  currentCategory?: string
}

export default function ComunidadesFilter({ comunidades, selected: init, currentSearch, currentCategory }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()
  const [selected, setSelected] = useState<Set<string>>(new Set(init))

  useEffect(() => { setSelected(new Set(init)) }, [init.join(",")])

  const push = (next: Set<string>) => {
    const params = new URLSearchParams()
    if (currentSearch) params.set("search", currentSearch)
    if (currentCategory) params.set("category", currentCategory)
    if (next.size > 0) params.set("com", [...next].join(","))
    startTransition(() => router.replace(`${pathname}?${params.toString()}`))
  }

  const toggle = (slug: string) => {
    const next = new Set(selected)
    if (next.has(slug)) next.delete(slug)
    else next.add(slug)
    setSelected(next)
    push(next)
  }

  const clear = () => {
    setSelected(new Set())
    push(new Set())
  }

  if (comunidades.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {comunidades.map((com) => {
        const active = selected.has(com.slug)
        return (
          <button
            key={com.idcomunidad}
            onClick={() => toggle(com.slug)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? "bg-violet-600 text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-600 hover:border-violet-300 hover:bg-violet-50"
            }`}
          >
            {com.nombre}
          </button>
        )
      })}
      {selected.size > 0 && (
        <button
          onClick={clear}
          className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition"
        >
          × Limpiar
        </button>
      )}
    </div>
  )
}
