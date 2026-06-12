"use client"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { createProductAction } from "@/features/products/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { createProductSchema, type ProductFormValues, type CreateProductDTO } from "@/types/product.types"

type Categoria = {
  idcategoria: number
  nombrecategoria: string
}

type Disponibilidad = {
  iddisponibilidad: number
  nombredisponibilidad: string
}

type Props = {
  categorias: Categoria[]
  disponibilidades: Disponibilidad[]
  userId: number
}

export default function ProductForm({ categorias, disponibilidades, userId }: Props) {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(createProductSchema)
  })

  const onSubmitHandler = handleSubmit(async (data) => {
    const result = await createProductAction({
      ...data,
      idusuario: userId,
      imageUrl: imageUrl ?? undefined,
    })

    if ("error" in result) {
      alert(result.error)
      return
    }

    router.push("/profile")
  })

  return (
    <form onSubmit={onSubmitHandler} className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.02fr_1fr]">

      {/* Imagen */}
      <div className="space-y-4 rounded-[28px] border border-white/10 bg-[#231f39]/90 p-6 shadow-[0_30px_90px_rgba(10,10,30,0.35)] backdrop-blur-xl sm:p-8">
        <label className="ml-1 block text-xs font-black uppercase tracking-[0.35em] text-indigo-100/80">
          Imagen del Producto
        </label>
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
              className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-white/15 bg-white/6 transition-all hover:border-indigo-300/70 hover:bg-white/10"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="p-10 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/8 text-indigo-100/90">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-100">Haz clic para subir una foto</p>
                </div>
              )}
            </div>
          )}
        </CldUploadWidget>
      </div>

      {/* Campos */}
      <div className="space-y-6 rounded-[28px] border border-white/10 bg-[#231f39]/90 p-8 shadow-[0_30px_90px_rgba(10,10,30,0.35)] backdrop-blur-xl sm:p-10">
        <div>
          <label className="mb-2 ml-1 block text-xs font-black uppercase tracking-[0.35em] text-indigo-100/80">Nombre</label>
          <input
            type="text"
            placeholder="Ej. Bata de Laboratorio"
            {...register("nombreproducto")}
            className="w-full rounded-xl border border-white/15 bg-white/8 px-5 py-4 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-indigo-300/70 focus:bg-white/12"
          />
          {errors.nombreproducto && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.nombreproducto.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 ml-1 block text-xs font-black uppercase tracking-[0.35em] text-indigo-100/80">Descripción</label>
          <textarea
            placeholder="Estado del producto, lugar de entrega..."
            {...register("descripcion")}
            className="h-24 w-full resize-none rounded-xl border border-white/15 bg-white/8 px-5 py-4 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-indigo-300/70 focus:bg-white/12"
          />
          {errors.descripcion && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.descripcion.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 ml-1 block text-xs font-black uppercase tracking-[0.35em] text-indigo-100/80">Categoría</label>
            <select
              {...register("idcategoria", { valueAsNumber: true })}
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-[#FF6B00] outline-none appearance-none text-gray-800"
            >
              <option value="">Seleccionar</option>
              {categorias.map((cat) => (
                <option key={cat.idcategoria} value={cat.idcategoria}>{cat.nombrecategoria}</option>
              ))}
            </select>
            {errors.idcategoria && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.idcategoria.message}</p>
            )}

            <label className="mb-2 ml-1 mt-4 block text-xs font-black uppercase tracking-[0.35em] text-indigo-100/80">Disponibilidad</label>
            <select
              {...register("iddisponibilidad", { valueAsNumber: true  })}
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-[#FF6B00] outline-none appearance-none text-gray-800"
            >
              <option value="">Seleccionar</option>
              {disponibilidades.map((d) => (
                <option key={d.iddisponibilidad} value={d.iddisponibilidad}>{d.nombredisponibilidad}</option>
              ))}
            </select>
            {errors.iddisponibilidad && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.iddisponibilidad.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 ml-1 block text-xs font-black uppercase tracking-[0.35em] text-indigo-100/80">Precio ($)</label>
            <input
              type="number"
              {...register("precio", { valueAsNumber: true })}
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-[#FF6B00] outline-none transition-all text-gray-800"
              min="0"
              step="0.01"
            />
            {errors.precio && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.precio.message}</p>
            )}

            <label className="mb-2 ml-1 mt-4 block text-xs font-black uppercase tracking-[0.35em] text-indigo-100/80">Stock</label>
            <input
              type="number"
              {...register("stock", { valueAsNumber: true })}
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-[#FF6B00] outline-none transition-all text-gray-800"
              min="0"
              step="1"
            />
            {errors.stock && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.stock.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-xl border border-white/15 bg-white/8 py-4 font-semibold text-slate-100 transition hover:bg-white/10"
          >
            CANCELAR
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-indigo-500 py-4 font-semibold text-white shadow-[0_18px_45px_rgba(88,80,160,0.35)] transition hover:bg-indigo-400 disabled:opacity-50"
          >
            {isSubmitting ? "PUBLICANDO..." : "PUBLICAR"}
          </button>
        </div>
      </div>
    </form>
  )
}