"use client"

import { useState } from "react"
import { updateMasterProfileAction } from "@/features/master/actions"

export default function MasterProfileForm({ nombre, telefono }: { nombre: string; telefono: string }) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("saving")
    setError("")

    const form = e.currentTarget
    const getValue = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value
    const contrasena = getValue("contrasena")

    try {
      const result = await updateMasterProfileAction({
        nombre: getValue("nombre"),
        telefono: getValue("telefono"),
        contrasena: contrasena || undefined,
      })

      if (result && "error" in result) {
        setError(result.error ?? "Error al guardar")
        setStatus("error")
        return
      }

      setStatus("saved")
      setTimeout(() => setStatus("idle"), 2500)
    } catch {
      setError("Error inesperado. Intenta de nuevo.")
      setStatus("error")
    }
  }

  const inputClass = "w-full rounded-lg bg-white border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-violet-500 transition-colors"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Nombre</label>
        <input name="nombre" defaultValue={nombre} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Teléfono</label>
        <input name="telefono" defaultValue={telefono} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>
          Nueva contraseña <span className="text-gray-400 font-normal">(dejar vacío para no cambiar)</span>
        </label>
        <input name="contrasena" type="password" className={inputClass} placeholder="••••••••" />
      </div>

      {status === "saved" && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          Perfil actualizado correctamente
        </p>
      )}
      {(status === "error" || error) && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error || "Error al guardar"}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "saving"}
        className="w-full h-11 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-sm font-semibold transition-colors"
      >
        {status === "saving" ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  )
}
