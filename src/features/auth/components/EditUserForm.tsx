"use client"
import { useForm } from "react-hook-form"
import { useState } from "react"
import Link from "next/link"
import { UpdateUserInput } from "@/types/auth.types"
import { useRouter } from "next/navigation"

type Props = {
  defaultNombre: string
  defaultTelefono: string
  updateUserAction: (data: UpdateUserInput) => Promise<{ error: string | undefined } | { success: boolean } | void>
}

const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:bg-white"
const labelClass = "mb-1.5 block text-sm font-medium text-gray-700"

export default function EditUserForm({ defaultNombre, defaultTelefono, updateUserAction }: Props) {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateUserInput>({
    defaultValues: { nombre: defaultNombre, telefono: defaultTelefono }
  })
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null)
    setLoading(true)
    const result = await updateUserAction(data)
    if (result && "error" in result) {
      setServerError(result.error || "Error desconocido")
      setLoading(false)
    } else {
      router.push("/profile?updated=true")
    }
  })

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Nombre</label>
        <input {...register("nombre")} placeholder="Tu nombre completo" className={inputClass} />
        {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Teléfono</label>
        <input {...register("telefono")} placeholder="Tu número de teléfono" className={inputClass} />
        {errors.telefono && <p className="mt-1 text-xs text-red-500">{errors.telefono.message}</p>}
      </div>

      <div>
        <label className={labelClass}>
          Nueva contraseña <span className="font-normal text-gray-400">(opcional)</span>
        </label>
        <input type="password" {...register("contrasena")} placeholder="Déjalo vacío para no cambiarla" className={inputClass} />
        {errors.contrasena && <p className="mt-1 text-xs text-red-500">{errors.contrasena.message}</p>}
      </div>

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-center font-semibold text-red-600">
          {serverError}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Link
          href="/profile"
          className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-700 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  )
}
