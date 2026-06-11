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
        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nombre</label>
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
        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Teléfono</label>
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
        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
          Nueva contraseña <span className="text-gray-400 font-normal">(opcional)</span>
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
          className="w-full py-4 bg-white border-2 border-gray-200 hover:border-[#FF6B00] text-gray-700 font-bold rounded-xl text-center transition-all"
        >
          CANCELAR
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#FF6B00] hover:bg-[#e66000] text-white font-black rounded-xl transition-all shadow-xl disabled:opacity-50"
        >
          {loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
        </button>
      </div>
    </form>
  )
}