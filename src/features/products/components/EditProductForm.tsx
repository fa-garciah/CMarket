"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { updateProductAction } from "@/features/products/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { createProductSchema, type ProductFormValues } from "@/types/product.types"
import { ImagePlus } from "lucide-react"

type Categoria = { idcategoria: number; nombrecategoria: string }
type Disponibilidad = { iddisponibilidad: number; nombredisponibilidad: string }

type Props = {
  idproducto: number
  categorias: Categoria[]
  disponibilidades: Disponibilidad[]
  defaultValues: ProductFormValues & { fotourl?: string | null }
}

const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:bg-white"
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-400"

export default function EditProductForm({ idproducto, categorias, disponibilidades, defaultValues }: Props) {
  const router = useRouter()
  const [imageUrl, setImageUrl]       = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(defaultValues.fotourl ?? null)

  const [serverError, setServerError]  = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      nombreproducto:  defaultValues.nombreproducto,
      descripcion:     defaultValues.descripcion,
      idcategoria:     defaultValues.idcategoria,
      iddisponibilidad: defaultValues.iddisponibilidad,
      precio:          defaultValues.precio,
      stock:           defaultValues.stock,
    },
  })

  const watchedDisponibilidad = watch("iddisponibilidad")

  useEffect(() => {
    const agotado = disponibilidades.find(
      (d) => d.nombredisponibilidad.toLowerCase().trim() === "agotado"
    )
    if (agotado && Number(watchedDisponibilidad) === agotado.iddisponibilidad) {
      setValue("stock", 0)
    }
  }, [watchedDisponibilidad, disponibilidades, setValue])

  const onSubmitHandler = handleSubmit(async (data) => {
    setServerError(null)
    const result = await updateProductAction(idproducto, {
      ...data,
      imageUrl: imageUrl ?? undefined,
    })
    if ("error" in result) { setServerError((result as { error: string }).error); return }
    router.push("/profile")
  })

  return (
    <form onSubmit={onSubmitHandler} className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_1.1fr]">

      {/* Imagen */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <label className={labelClass}>Imagen del Producto</label>
        <CldUploadWidget
          uploadPreset="anahuarket_products"
          onSuccess={(result) => {
            if (result.info && typeof result.info === "object") {
              const info = result.info as { secure_url: string }
              setImageUrl(info.secure_url)
              setImagePreview(info.secure_url)
            }
          }}
        >
          {({ open }) => (
            <div
              onClick={() => open()}
              className="group relative mt-2 flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-violet-400 hover:bg-violet-50/40"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-sm font-semibold text-white">Cambiar imagen</p>
                  </div>
                </>
              ) : (
                <div className="p-10 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                    <ImagePlus size={24} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-500">Haz clic para subir una foto</p>
                  <p className="mt-1 text-xs text-gray-400">PNG, JPG, WEBP</p>
                </div>
              )}
            </div>
          )}
        </CldUploadWidget>
      </div>

      {/* Campos */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 space-y-5">
        <div>
          <label className={labelClass}>Nombre</label>
          <input type="text" {...register("nombreproducto")} className={inputClass} />
          {errors.nombreproducto && <p className="mt-1 ml-1 text-xs text-red-500">{errors.nombreproducto.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Descripción</label>
          <textarea {...register("descripcion")} className={`${inputClass} h-24 resize-none`} />
          {errors.descripcion && <p className="mt-1 ml-1 text-xs text-red-500">{errors.descripcion.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Categoría</label>
            <select {...register("idcategoria", { valueAsNumber: true })} className={inputClass}>
              {categorias.map((cat) => (
                <option key={cat.idcategoria} value={cat.idcategoria}>{cat.nombrecategoria}</option>
              ))}
            </select>
            {errors.idcategoria && <p className="mt-1 ml-1 text-xs text-red-500">{errors.idcategoria.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Precio ($)</label>
            <input type="number" {...register("precio", { valueAsNumber: true })} className={inputClass} min="0" step="0.01" />
            {errors.precio && <p className="mt-1 ml-1 text-xs text-red-500">{errors.precio.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Disponibilidad</label>
            <select {...register("iddisponibilidad", { valueAsNumber: true })} className={inputClass}>
              {disponibilidades.map((d) => (
                <option key={d.iddisponibilidad} value={d.iddisponibilidad}>{d.nombredisponibilidad}</option>
              ))}
            </select>
            {errors.iddisponibilidad && <p className="mt-1 ml-1 text-xs text-red-500">{errors.iddisponibilidad.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Stock</label>
            <input type="number" {...register("stock", { valueAsNumber: true })} className={inputClass} min="0" step="1" />
            {errors.stock && <p className="mt-1 ml-1 text-xs text-red-500">{errors.stock.message}</p>}
          </div>
        </div>

        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-700 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </form>
  )
}
