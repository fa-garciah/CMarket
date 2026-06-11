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
    <form onSubmit={onSubmitHandler} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

      {/* Imagen */}
      <div className="space-y-4">
        <label className="block text-sm font-black text-gray-400 uppercase tracking-widest ml-1">
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
              className="relative group aspect-square bg-white border-4 border-dashed border-gray-100 rounded-[3rem] overflow-hidden flex flex-col items-center justify-center transition-all hover:border-[#FF6B00]/30 cursor-pointer"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-10">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 font-bold text-sm">Haz clic para subir una foto</p>
                </div>
              )}
            </div>
          )}
        </CldUploadWidget>
      </div>

      {/* Campos */}
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 space-y-6">
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nombre</label>
          <input
            type="text"
            placeholder="Ej. Bata de Laboratorio"
            {...register("nombreproducto")}
            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#FF6B00] outline-none transition-all text-gray-800"
          />
          {errors.nombreproducto && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.nombreproducto.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Descripción</label>
          <textarea
            placeholder="Estado del producto, lugar de entrega..."
            {...register("descripcion")}
            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#FF6B00] outline-none transition-all h-24 resize-none text-gray-800"
          />
          {errors.descripcion && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.descripcion.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Categoría</label>
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

            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 mt-4">Disponibilidad</label>
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
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Precio ($)</label>
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

            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 mt-4">Stock</label>
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
            className="flex-1 py-4 bg-white border-2 border-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-50 transition-all"
          >
            CANCELAR
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-4 bg-[#FF6B00] text-white font-black rounded-2xl shadow-xl shadow-orange-200 hover:bg-[#e66000] transition-all transform hover:scale-[1.02] disabled:opacity-50"
          >
            {isSubmitting ? "PUBLICANDO..." : "PUBLICAR"}
          </button>
        </div>
      </div>
    </form>
  )
}