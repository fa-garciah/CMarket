"use client"

import { useState, useTransition } from "react"
import { publishToComAction, unpublishFromComAction } from "@/features/products/actions"
import { Globe, Check, Loader2 } from "lucide-react"

type Comunidad = { idcomunidad: number; nombre: string; slug: string }

type Props = {
  idproducto: number
  comunidades: Comunidad[]
  publicadas: number[]
}

export default function PublicarEnComunidades({ idproducto, comunidades, publicadas }: Props) {
  const [, startTransition] = useTransition()
  const [activeSet, setActiveSet] = useState<Set<number>>(new Set(publicadas))
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<number, string>>({})

  const toggle = (idcomunidad: number) => {
    const isPublished = activeSet.has(idcomunidad)
    setLoadingId(idcomunidad)
    setErrors((e) => { const next = { ...e }; delete next[idcomunidad]; return next })

    startTransition(async () => {
      const result = isPublished
        ? await unpublishFromComAction(idproducto, idcomunidad)
        : await publishToComAction(idproducto, idcomunidad)

      if ("error" in result) {
        setErrors((e) => ({ ...e, [idcomunidad]: (result as { error: string }).error }))
      } else {
        setActiveSet((prev) => {
          const next = new Set(prev)
          if (isPublished) next.delete(idcomunidad)
          else next.add(idcomunidad)
          return next
        })
      }
      setLoadingId(null)
    })
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Globe size={15} className="text-violet-500" />
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Publicar en comunidades</h2>
      </div>

      {comunidades.length === 0 ? (
        <p className="text-sm text-gray-400">No perteneces a ninguna comunidad activa.</p>
      ) : (
        <ul className="space-y-2">
          {comunidades.map((com) => {
            const isPublished = activeSet.has(com.idcomunidad)
            const isLoading = loadingId === com.idcomunidad

            return (
              <li key={com.idcomunidad}>
                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <span className="text-sm font-semibold text-gray-800">{com.nombre}</span>
                  <button
                    onClick={() => toggle(com.idcomunidad)}
                    disabled={isLoading}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${
                      isPublished
                        ? "bg-violet-600 text-white hover:bg-violet-700"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : isPublished ? (
                      <><Check size={12} />Publicado</>
                    ) : (
                      "Publicar"
                    )}
                  </button>
                </div>
                {errors[com.idcomunidad] && (
                  <p className="mt-1 ml-1 text-xs text-red-500">{errors[com.idcomunidad]}</p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
