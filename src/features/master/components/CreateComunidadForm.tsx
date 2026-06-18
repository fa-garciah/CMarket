"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createComunidadAction, getUsuariosListAction } from "@/features/master/actions"

type UsuarioOption = { idusuario: number; nombre: string; correo: string }

export default function CreateComunidadForm() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [usuarios, setUsuarios] = useState<UsuarioOption[]>([])

  useEffect(() => {
    getUsuariosListAction().then(setUsuarios)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = e.currentTarget
    const nombre = (form.elements.namedItem("nombre") as HTMLInputElement).value
    const descripcion = (form.elements.namedItem("descripcion") as HTMLTextAreaElement).value
    const idadminRaw = (form.elements.namedItem("idadmin") as HTMLSelectElement).value

    try {
      const result = await createComunidadAction({
        nombre,
        descripcion: descripcion || undefined,
        idadmin: idadminRaw ? Number(idadminRaw) : undefined,
      })

      if ("error" in result) {
        setError(result.error ?? "Error al crear la comunidad")
        setLoading(false)
        return
      }

      router.push("/master/comunidades")
    } catch {
      setError("Error inesperado. Intenta de nuevo.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Nombre <span className="text-red-500">*</span>
        </label>
        <input
          name="nombre"
          required
          className="w-full rounded-lg bg-white border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-500 transition-colors"
          placeholder="Ej. Universidad Anáhuac Cancún"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Descripción <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <textarea
          name="descripcion"
          rows={3}
          className="w-full rounded-lg bg-white border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-500 transition-colors resize-none"
          placeholder="Breve descripción de la comunidad"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Administrador <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <select
          name="idadmin"
          className="w-full rounded-lg bg-white border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-violet-500 transition-colors"
        >
          <option value="">Sin administrador por ahora</option>
          {usuarios.map((u) => (
            <option key={u.idusuario} value={u.idusuario}>
              {u.nombre} — {u.correo}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-1">
          El usuario seleccionado quedará como ADMIN de esta comunidad y podrá aprobar solicitudes de ingreso.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-sm font-semibold transition-colors"
      >
        {loading ? "Creando..." : "Crear comunidad"}
      </button>
    </form>
  )
}
