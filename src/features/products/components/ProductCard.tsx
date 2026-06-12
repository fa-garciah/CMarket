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
      <article className="group h-full overflow-hidden rounded-[24px] border border-white/10 bg-[#231f39]/90 shadow-[0_18px_45px_rgba(10,10,30,0.28)] transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300/70 hover:bg-[#2a2444] hover:shadow-[0_28px_60px_rgba(88,80,160,0.35)]">
        <div className="relative h-44 overflow-hidden bg-slate-800/70">
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
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#13111f] via-[#13111f]/80 to-transparent" />
        </div>

        <div className="p-4 text-white">
          <p className="text-[11px] uppercase tracking-[0.28em] text-indigo-100/80">{vendedor.nombre}</p>
          <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-50">{nombreproducto}</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-lg font-black text-indigo-200">${precio.toLocaleString('es-MX')}</p>
            <span className="rounded-full border border-indigo-300/40 bg-indigo-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-indigo-100">Ver más</span>
          </div>
        </div>
      </article>
    </Link>
  )
}