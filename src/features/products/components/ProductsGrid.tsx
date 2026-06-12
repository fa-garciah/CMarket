"use client"

import ProductCard from "./ProductCard"
import type { ProductCardDTO } from "@/types/product.types"

type Props = {
  products: ProductCardDTO[]
  userName: string | null | undefined
}

export default function ProductosGrid({ products, userName }: Props) {

  return (
    <main className="relative mx-auto flex w-full max-w-7xl flex-grow flex-col px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 rounded-[28px] border border-white/10 bg-[#231f39]/90 p-6 shadow-[0_30px_90px_rgba(10,10,30,0.35)] backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-indigo-100/80">Inicio</p>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              ¡Qué bueno verte, {userName?.split(' ')[0] || 'Estudiante'}!
            </h2>
            <p className="max-w-2xl text-sm text-slate-200/95 sm:text-base">
              Explora lo que hay disponible en la Anáhuac Cancún con una experiencia más limpia y visualmente alineada a la plataforma.
            </p>
          </div>

          <div className="grid gap-3 rounded-[24px] border border-white/10 bg-white/6 p-4 text-sm text-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.25)] backdrop-blur-sm sm:grid-cols-3 lg:min-w-[420px]">
            <article>
              <p className="text-xs uppercase tracking-[0.28em] text-indigo-100/80">Catálogo</p>
              <p className="mt-2 text-2xl font-black text-white">{products.length}</p>
            </article>
            <article>
              <p className="text-xs uppercase tracking-[0.28em] text-indigo-100/80">Estado</p>
              <p className="mt-2 text-2xl font-black text-emerald-200">En vivo</p>
            </article>
            <article>
              <p className="text-xs uppercase tracking-[0.28em] text-indigo-100/80">Vista</p>
              <p className="mt-2 text-2xl font-black text-white">Home</p>
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
        <div className="rounded-[28px] border border-dashed border-white/15 bg-[#231f39]/70 py-16 text-center shadow-[0_30px_90px_rgba(10,10,30,0.25)] backdrop-blur-xl">
          <p className="text-lg font-semibold text-white">No se encontraron productos.</p>
          <p className="mt-2 text-sm text-slate-200/90">Prueba con otra búsqueda o categoría para ver más opciones.</p>
        </div>
      )}
    </main>
  )
}