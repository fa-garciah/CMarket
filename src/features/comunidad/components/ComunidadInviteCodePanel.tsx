"use client"

import { useState } from "react"
import { generateComunidadInviteCodeAction, revokeComunidadInviteCodeAction } from "@/features/user/actions"
import { RefreshCw, X, Copy, Check, Link2 } from "lucide-react"

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
  if (h >= 48) return `${Math.floor(h / 24)} días`
  if (h > 0)   return `${h}h ${m}m`
  return `${m}m`
}

type Props = {
  idcomunidad: number
  codigoinvitacion: string | null
  codigoexpiracion: string | null
}

export default function ComunidadInviteCodePanel({ idcomunidad, codigoinvitacion: initCodigo, codigoexpiracion: initExp }: Props) {
  const [codigo,     setCodigo]     = useState(initCodigo)
  const [expiracion, setExpiracion] = useState(initExp)
  const [horas,      setHoras]      = useState(24)
  const [loading,    setLoading]    = useState(false)
  const [copied,     setCopied]     = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  const isActive = !!(codigo && expiracion && new Date(expiracion) > new Date())

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    const result = await generateComunidadInviteCodeAction(idcomunidad, horas)
    if ("error" in result) {
      setError(result.error)
    } else {
      setCodigo(result.codigoinvitacion)
      setExpiracion(result.codigoexpiracion)
    }
    setLoading(false)
  }

  async function handleRevoke() {
    setLoading(true)
    setError(null)
    const result = await revokeComunidadInviteCodeAction(idcomunidad)
    if ("error" in result) {
      setError((result as { error: string }).error)
    } else {
      setCodigo(null)
      setExpiracion(null)
    }
    setLoading(false)
  }

  function handleCopy() {
    if (!codigo) return
    navigator.clipboard.writeText(codigo)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mb-6 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
        <Link2 size={15} className="text-violet-500" />
        <h2 className="text-sm font-semibold text-gray-700">Código de Invitación</h2>
      </div>

      <div className="px-5 py-4">
        {error && (
          <p className="mb-3 rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-600">{error}</p>
        )}

        {isActive ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-violet-50 border border-violet-100 px-4 py-3">
              <span className="font-mono text-sm text-violet-700 break-all flex-1">{codigo}</span>
              <button
                onClick={handleCopy}
                className="shrink-0 rounded-lg p-1.5 text-violet-500 hover:bg-violet-100 transition-colors"
                title="Copiar código"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-emerald-600 font-medium">
                Expira en {formatExpiry(expiracion!)}
              </span>
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={handleRevoke}
                  disabled={loading}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                >
                  <X size={12} />
                  Revocar
                </button>
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
                    className="flex items-center gap-1 text-xs text-violet-500 hover:text-violet-700 transition-colors disabled:opacity-40"
                  >
                    <RefreshCw size={12} />
                    Renovar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {codigo && expiracion && (
              <p className="text-xs text-red-400 font-medium">El código expiró</p>
            )}
            {!codigo && (
              <p className="text-xs text-gray-400">No hay ningún código activo. Genera uno para que los usuarios puedan unirse.</p>
            )}
            <div className="flex items-center gap-3">
              <select
                value={horas}
                onChange={(e) => setHoras(Number(e.target.value))}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-violet-400"
              >
                {DURACIONES.map((d) => (
                  <option key={d.horas} value={d.horas}>{d.label}</option>
                ))}
              </select>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors disabled:opacity-40"
              >
                {loading ? "Generando..." : "Generar código"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
