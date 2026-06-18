"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserMasterAction } from "@/features/master/actions"

export default function CreateUserForm() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = e.currentTarget
    const getValue = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value

    try {
      const result = await createUserMasterAction({
        nombre: getValue("nombre"),
        correo: getValue("correo"),
        telefono: getValue("telefono"),
        contrasena: getValue("contrasena"),
        rolapp: "USER",
      })

      if ("error" in result) {
        setError(result.error ?? "Error al crear el usuario")
        setLoading(false)
        return
      }

      router.push("/master/usuarios")
    } catch {
      setError("Error inesperado. Intenta de nuevo.")
      setLoading(false)
    }
  }

  const inputClass = "w-full rounded-lg bg-white border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-500 transition-colors"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Nombre <span className="text-red-500">*</span></label>
        <input name="nombre" required className={inputClass} placeholder="Nombre completo" />
      </div>

      <div>
        <label className={labelClass}>Correo <span className="text-red-500">*</span></label>
        <input name="correo" type="email" required className={inputClass} placeholder="correo@ejemplo.com" />
      </div>

      <div>
        <label className={labelClass}>Teléfono <span className="text-red-500">*</span></label>
        <input name="telefono" required className={inputClass} placeholder="+52 998 000 0000" />
      </div>

      <div>
        <label className={labelClass}>Contraseña <span className="text-red-500">*</span></label>
        <input name="contrasena" type="password" required className={inputClass} placeholder="Mín. 8 caracteres, mayúscula y número" />
      </div>

      <p className="text-xs text-gray-400">
        El usuario se crea como miembro regular. Para asignarlo como administrador de una comunidad, hazlo desde la sección de Comunidades.
      </p>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-sm font-semibold transition-colors"
      >
        {loading ? "Creando..." : "Crear usuario"}
      </button>
    </form>
  )
}
