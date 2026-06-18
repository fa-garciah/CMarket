"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { updateComunidadAction } from "@/features/master/actions"

const editComunidadSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  descripcion: z.string().max(500, "La descripción no puede tener más de 500 caracteres").optional(),
})

type EditComunidadValues = z.infer<typeof editComunidadSchema>

type Props = {
  idcomunidad: number
  nombre: string
  descripcion?: string | null
  onSaved: (data: { nombre: string; descripcion?: string }) => void
  onCancel: () => void
}

export default function EditComunidadForm({
  idcomunidad,
  nombre,
  descripcion,
  onSaved,
  onCancel,
}: Props) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditComunidadValues>({
    resolver: zodResolver(editComunidadSchema),
    defaultValues: {
      nombre,
      descripcion: descripcion ?? "",
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null)
    setIsSaving(true)

    const result = await updateComunidadAction({
      idcomunidad,
      nombre: data.nombre,
      descripcion: data.descripcion,
    })

    setIsSaving(false)

    if ("error" in result) {
      setServerError(result.error)
      return
    }

    onSaved({ nombre: data.nombre, descripcion: data.descripcion })
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre de comunidad</label>
        <input
          type="text"
          {...register("nombre")}
          className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />
        {errors.nombre && <p className="mt-2 text-sm text-red-600">{errors.nombre.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          rows={4}
          {...register("descripcion")}
          className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />
        {errors.descripcion && <p className="mt-2 text-sm text-red-600">{errors.descripcion.message}</p>}
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  )
}
