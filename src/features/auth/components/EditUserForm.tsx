"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { UpdateUserInput } from "@/types/auth.types";
import { useRouter } from "next/navigation";

type Props = {
  defaultNombre: string
  defaultTelefono: string
  updateUserAction: (data: UpdateUserInput) => Promise<{ error: string | undefined } | { success: boolean } | void>
}

export default function EditUserForm({ defaultNombre, defaultTelefono, updateUserAction }: Props) {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateUserInput>({
    defaultValues: {
      nombre: defaultNombre,
      telefono: defaultTelefono
    }
  })
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null)
    setLoading(true)
    const result = await updateUserAction(data)
    if (result && 'error' in result) {
      setServerError(result.error || "Error desconocido")
      setLoading(false)
    } else {
      router.push("/profile?updated=true")
    }
  })

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="mb-2 ml-1 block text-sm font-semibold text-slate-100">Nombre</label>
        <input
          {...register("nombre")}
          placeholder="Tu nombre completo"
          className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#FF6B00] outline-none transition-all text-gray-700"
        />
        {errors.nombre && (
          <p className="text-red-500 text-xs mt-1 ml-1">{errors.nombre.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 ml-1 block text-sm font-semibold text-slate-100">Teléfono</label>
        <input
          {...register("telefono")}
          placeholder="Tu número de teléfono"
          className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#FF6B00] outline-none transition-all text-gray-700"
        />
        {errors.telefono && (
          <p className="text-red-500 text-xs mt-1 ml-1">{errors.telefono.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 ml-1 block text-sm font-semibold text-slate-100">
          Nueva contraseña <span className="font-normal text-slate-300">(opcional)</span>
        </label>
        <input
          type="password"
          {...register("contrasena")}
          placeholder="Déjalo vacío para no cambiarla"
          className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#FF6B00] outline-none transition-all text-gray-700"
        />
        {errors.contrasena && (
          <p className="text-red-500 text-xs mt-1 ml-1">{errors.contrasena.message}</p>
        )}
      </div>

      {serverError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-semibold border border-red-100">
          {serverError}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Link
          href="/profile"
          className="w-full rounded-xl border border-white/15 bg-white/8 py-4 text-center font-semibold text-slate-100 transition hover:border-indigo-300/60 hover:bg-white/10"
        >
          CANCELAR
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-500 py-4 font-semibold text-white shadow-[0_18px_45px_rgba(88,80,160,0.35)] transition hover:bg-indigo-400 disabled:opacity-50"
        >
          {loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
        </button>
      </div>
    </form>
  )
}