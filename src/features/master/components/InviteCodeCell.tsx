"use client"

import { useState } from "react"
import { generateInviteCodeAction, revokeInviteCodeAction } from "@/features/master/actions"
import CopyButton from "@/features/master/components/CopyButton"
import { RefreshCw, X, Link2 } from "lucide-react"

const DURACIONES = [
  { label: "1 hora",   horas: 1 },
  { label: "24 horas", horas: 24 },
  { label: "7 días",   horas: 168 },
  { label: "30 días",  horas: 720 },
]

function formatExpiry(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now()
  if (diff <= 0) return "Expirado"
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (h >= 48) return `${Math.floor(h / 24)}d`
  if (h > 0)   return `${h}h ${m}m`
  return `${m}m`
}

type Props = {
  idcomunidad: number
  codigoinvitacion: string | null
  codigoexpiracion: string | null   // ISO string from server serialization
}

export default function InviteCodeCell({ idcomunidad, codigoinvitacion, codigoexpiracion }: Props) {
  const [codigo,     setCodigo]     = useState(codigoinvitacion)
  const [expiracion, setExpiracion] = useState(codigoexpiracion)
  const [horas,      setHoras]      = useState(24)
  const [loading,    setLoading]    = useState(false)

  const isActive = !!(codigo && expiracion && new Date(expiracion) > new Date())

  async function handleGenerate() {
    setLoading(true)
    const result = await generateInviteCodeAction(idcomunidad, horas)
    setCodigo(result.codigoinvitacion)
    setExpiracion(result.codigoexpiracion)
    setLoading(false)
  }

  async function handleRevoke() {
    setLoading(true)
    await revokeInviteCodeAction(idcomunidad)
    setCodigo(null)
    setExpiracion(null)
    setLoading(false)
  }

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/unirse/${codigo}`
      : `/unirse/${codigo}`

  if (isActive) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Link2 size={12} className="text-violet-400 shrink-0" />
          <span className="font-mono text-xs text-gray-500 truncate max-w-[120px]">{codigo}</span>
          <CopyButton value={inviteUrl} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-emerald-600 font-medium">
            Expira en {formatExpiry(expiracion!)}
          </span>
          <span className="text-gray-300">·</span>
          <button
            onClick={handleRevoke}
            disabled={loading}
            className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
          >
            <X size={10} />
            Revocar
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-1 text-[11px] text-violet-500 hover:text-violet-700 transition-colors disabled:opacity-40"
          >
            <RefreshCw size={10} />
            Renovar
          </button>
        </div>
      </div>
    )
  }

  // No code or expired
  return (
    <div className="flex flex-col gap-1.5">
      {codigo && expiracion && (
        <span className="text-[11px] text-red-400 font-medium">Código expirado</span>
      )}
      {!codigo && (
        <span className="text-[11px] text-gray-400">Sin código activo</span>
      )}
      <div className="flex items-center gap-2">
        <select
          value={horas}
          onChange={(e) => setHoras(Number(e.target.value))}
          className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:outline-none focus:border-violet-400"
        >
          {DURACIONES.map((d) => (
            <option key={d.horas} value={d.horas}>{d.label}</option>
          ))}
        </select>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-lg bg-violet-50 border border-violet-200 px-3 py-1 text-xs font-medium text-violet-700 hover:bg-violet-100 transition-colors disabled:opacity-40"
        >
          {loading ? "..." : "Generar"}
        </button>
      </div>
    </div>
  )
}
