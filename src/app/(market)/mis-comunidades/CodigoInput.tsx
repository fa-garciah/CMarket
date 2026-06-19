"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Hash } from "lucide-react"

export default function CodigoInput() {
  const [codigo, setCodigo] = useState("")
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = codigo.trim()
    if (!trimmed) return
    router.push(`/unirse/${trimmed}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Pega tu código de invitación"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-8 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:border-violet-400 focus:bg-white focus:outline-none transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={!codigo.trim()}
        className="rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
      >
        Unirse
      </button>
    </form>
  )
}
