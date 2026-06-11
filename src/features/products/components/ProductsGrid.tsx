"use client"

import ProductCard from "./ProductCard"
import type { ProductCardDTO } from "@/types/product.types"

type Props = {
  products: ProductCardDTO[]
  userName: string | null | undefined
}

export default function ProductosGrid({ products, userName }: Props) {

  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10">
      <section className="text-center mb-10">
        <h2 className="text-2xl font-black text-gray-800">
          ¡Qué bueno verte, {userName?.split(' ')[0] || 'Estudiante'}!
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Explora lo que hay disponible en la Anáhuac Cancún.
        </p>
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((prod) => (
          <ProductCard key={prod.idproducto} {...prod} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400">No se encontraron productos.</p>
        </div>
      )}
    </main>
  )
}