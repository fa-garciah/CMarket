"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateMembresiaEstadoAction } from "@/features/user/actions"

type Estado = "APROBADA" | "RECHAZADA" | "BLOQUEADA" | "PENDIENTE"

type Action = {
  label: string
  estado: Estado
  style: string
}

const ACTIONS: Record<string, Action[]> = {
  PENDIENTE: [
    { label: "Aprobar",  estado: "APROBADA",  style: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" },
    { label: "Rechazar", estado: "RECHAZADA", style: "bg-red-50 border-red-200 text-red-600 hover:bg-red-100" },
  ],
  APROBADA: [
    { label: "Bloquear", estado: "BLOQUEADA", style: "bg-red-50 border-red-200 text-red-600 hover:bg-red-100" },
  ],
  BLOQUEADA: [
    { label: "Desbloquear", estado: "APROBADA", style: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" },
  ],
  RECHAZADA: [
    { label: "Aprobar", estado: "APROBADA", style: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" },
  ],
}

export default function MemberActions({
  idmembresia,
  estadoActual,
}: {
  idmembresia: number
  estadoActual: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const router = useRouter()

  const actions = ACTIONS[estadoActual] ?? []

  async function handleAction(estado: Estado) {
    setLoading(true)
    setError(null)
    const result = await updateMembresiaEstadoAction(idmembresia, estado)
    setLoading(false)
    if ("error" in result) { setError(result.error); return }
    router.refresh()
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        {actions.map((a) => (
          <button
            key={a.estado}
            onClick={() => handleAction(a.estado)}
            disabled={loading}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 ${a.style}`}
          >
            {a.label}
          </button>
        ))}
      </div>
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  )
}
