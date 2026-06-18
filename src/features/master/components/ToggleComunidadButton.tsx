"use client"

import { useTransition } from "react"
import { toggleComunidadAction } from "@/features/master/actions"
import { useRouter } from "next/navigation"

export default function ToggleComunidadButton({ idcomunidad, isactive }: { idcomunidad: number; isactive: number }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      await toggleComunidadAction(idcomunidad, isactive === 1 ? 0 : 1)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
        isactive === 1
          ? "bg-red-100 text-red-600 hover:bg-red-200"
          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
      }`}
    >
      {pending ? "..." : isactive === 1 ? "Desactivar" : "Activar"}
    </button>
  )
}
