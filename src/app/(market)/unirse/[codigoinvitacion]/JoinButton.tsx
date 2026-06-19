"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { solicitarUnirseAction } from "@/features/user/actions"

export default function JoinButton({ codigoinvitacion }: { codigoinvitacion: string }) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleJoin() {
    setLoading(true)
    setError(null)
    const result = await solicitarUnirseAction(codigoinvitacion)
    setLoading(false)
    if ("error" in result) {
      setError((result as { error: string }).error)
      return
    }
    setSuccess(true)
    router.refresh()
  }

  if (success) {
    return (
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-3 text-sm text-emerald-700">
        Solicitud enviada. Espera la aprobación del administrador.
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleJoin}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-60 px-8 py-3 text-sm font-semibold text-white transition-colors"
      >
        {loading ? "Enviando solicitud..." : "Solicitar unirme"}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
