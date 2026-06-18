"use client"

import ProductCard from "./ProductCard"
import type { ProductCardDTO } from "@/types/product.types"

type Props = {
  products: ProductCardDTO[]
  userName: string | null | undefined
}

export default function ProductosGrid({ products, userName }: Props) {
  return (
    <main className="mx-auto flex w-full max-w-7xl grow flex-col px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Inicio</p>
            <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              ¡Qué bueno verte, {userName?.split(' ')[0] || 'Usuario'}!
            </h2>
            <p className="max-w-2xl text-sm text-gray-500 sm:text-base">
              Explora los artículos disponibles en tu comunidad.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm lg:min-w-[320px]">
            <article>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Catálogo</p>
              <p className="mt-1.5 text-2xl font-black text-gray-900">{products.length}</p>
            </article>
            <article>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Estado</p>
              <p className="mt-1.5 text-2xl font-black text-emerald-600">En vivo</p>
            </article>
            <article>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Vista</p>
              <p className="mt-1.5 text-2xl font-black text-gray-900">Home</p>
            </article>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((prod) => (
          <ProductCard key={prod.idproducto} {...prod} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-700">No se encontraron productos.</p>
          <p className="mt-2 text-sm text-gray-400">Prueba con otra búsqueda o categoría.</p>
        </div>
      )}
    </main>
  )
}
