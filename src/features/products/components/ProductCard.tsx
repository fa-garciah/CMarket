import Link from "next/link"
import type { ProductCardDTO } from "@/types/product.types"

export default function ProductCard({ idproducto, nombreproducto, precio, fotoproducto, fotourl, vendedor }: ProductCardDTO) {
  const imageSrc = fotourl
    ? fotourl
    : fotoproducto
      ? `/api/productos/${idproducto}/foto`
      : null

  return (
    <Link href={`/products/${idproducto}`}>
      <article className="group h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-violet-200">
        <div className="relative h-44 overflow-hidden bg-gray-100">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={nombreproducto}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <img
              src="/placeholder.png"
              alt="Sin imagen"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          )}
        </div>

        <div className="p-4">
          <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">{vendedor.nombre}</p>
          <p className="mt-1.5 line-clamp-2 text-sm font-semibold text-gray-800">{nombreproducto}</p>
          <div className="mt-3 flex items-end justify-between gap-2">
            <p className="text-lg font-black text-violet-600">${precio.toLocaleString('es-MX')}</p>
            <span className="rounded-full bg-violet-50 border border-violet-100 px-2.5 py-1 text-[10px] uppercase tracking-widest text-violet-600 font-medium">Ver más</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
