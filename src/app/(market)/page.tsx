import { auth } from "@/server/auth"
import { getComunidadesAprobadasByUser } from "@/server/services/membresiaService"
import {
  getProductosDeMisComunidades,
  getProducts,
  getUserProductCount,
} from "@/server/services/productService"
import ProductCard from "@/features/products/components/ProductCard"
import Link from "next/link"
import { PlusCircle, Users, Package } from "lucide-react"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>
}) {
  const { search, category } = await searchParams
  const session = await auth()
  const userId = Number(session?.user?.id)

  const [comunidades, misProductosCount] = await Promise.all([
    getComunidadesAprobadasByUser(userId),
    getUserProductCount(userId),
  ])

  const hasComunidades = comunidades.length > 0

  const rawProducts = hasComunidades
    ? await getProductosDeMisComunidades(userId)
    : (await getProducts()).map((p) => ({
        idproducto:     p.idproducto,
        nombreproducto: p.nombreproducto,
        precio:         Number(p.precio),
        fotoproducto:   !!p.fotoproducto,
        fotourl:        p.fotourl,
        vendedor:       p.vendedor,
        categoria:      p.categoria,
      }))

  const productos = rawProducts.filter((p) => {
    const matchSearch = search
      ? p.nombreproducto.toLowerCase().includes(search.toLowerCase())
      : true
    const matchCategory = category
      ? p.categoria.nombrecategoria.toLowerCase() === category.toLowerCase()
      : true
    return matchSearch && matchCategory
  })

  const firstName = session?.user?.name?.split(" ")[0] ?? "Usuario"

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Header + stats */}
      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Inicio</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              ¡Hola, {firstName}!
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {hasComunidades
                ? "Aquí están los artículos de tus comunidades."
                : "Únete a una comunidad para ver artículos personalizados."}
            </p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
            <div className="px-5 py-4 text-center">
              <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">Comunidades</p>
              <p className="mt-1 text-2xl font-black text-violet-600">{comunidades.length}</p>
            </div>
            <div className="px-5 py-4 text-center">
              <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">Mis productos</p>
              <p className="mt-1 text-2xl font-black text-gray-900">{misProductosCount}</p>
            </div>
            <div className="px-5 py-4 text-center">
              <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">Artículos</p>
              <p className="mt-1 text-2xl font-black text-gray-900">{productos.length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Communities row */}
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={13} className="text-gray-400" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Mis comunidades
            </h2>
          </div>
          <Link
            href="/mis-comunidades"
            className="text-xs font-semibold text-violet-600 transition-colors hover:text-violet-800"
          >
            Ver todas →
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {comunidades.map((com) => (
            <Link
              key={com.idcomunidad}
              href={`/comunidad/${com.slug}`}
              className="shrink-0 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm transition hover:border-violet-300 hover:shadow-md"
            >
              <p className="text-sm font-bold text-gray-800">{com.nombre}</p>
              <p className="mt-0.5 text-xs text-violet-500">Ver artículos →</p>
            </Link>
          ))}
          <Link
            href="/mis-comunidades"
            className="shrink-0 rounded-xl border border-dashed border-gray-300 px-5 py-3 transition hover:border-violet-400 hover:bg-violet-50"
          >
            <p className="text-sm font-semibold text-gray-400">+ Unirse a comunidad</p>
          </Link>
        </div>
      </section>

      {/* Products */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={13} className="text-gray-400" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              {hasComunidades ? "Artículos en tus comunidades" : "Catálogo general"}
            </h2>
          </div>
          <Link
            href="/agregar-producto"
            className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
          >
            <PlusCircle size={13} />
            Publicar
          </Link>
        </div>

        {productos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center shadow-sm">
            {hasComunidades ? (
              <>
                <p className="font-semibold text-gray-700">
                  No hay artículos publicados en tus comunidades aún.
                </p>
                <p className="mt-1 text-sm text-gray-400">Sé el primero en publicar algo.</p>
                <Link
                  href="/agregar-producto"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  <PlusCircle size={14} />
                  Publicar producto
                </Link>
              </>
            ) : (
              <>
                <p className="font-semibold text-gray-700">No se encontraron productos.</p>
                <p className="mt-1 text-sm text-gray-400">
                  Prueba con otra búsqueda o{" "}
                  <Link href="/mis-comunidades" className="text-violet-600 hover:underline">
                    únete a una comunidad
                  </Link>
                  .
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {productos.map((prod) => (
              <ProductCard key={prod.idproducto} {...prod} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
