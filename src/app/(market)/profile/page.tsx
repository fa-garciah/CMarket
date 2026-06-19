import { auth } from "@/server/auth"
import { getProductsByUser } from "@/server/services/productService"
import ProductCard from "@/features/products/components/ProductCard"
import Link from "next/link"
import { Package, PlusCircle } from "lucide-react"

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string; purchased?: string }>
}) {
  const { updated, purchased } = await searchParams
  const session = await auth()

  const products = await getProductsByUser(Number(session?.user?.id))

  const serialized = products.map((p) => ({
    ...p,
    precio: Number(p.precio),
    fotoproducto: p.fotoproducto ? true : false,
    fechapublicacion: p.fechapublicacion.toISOString(),
  }))

  return (
    <div className="mx-auto w-full max-w-7xl p-6 sm:p-8 lg:p-10">
      {updated && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-sm font-semibold text-emerald-700">
          Perfil actualizado. Los cambios de nombre se verán al cerrar sesión y volver a entrar.
        </div>
      )}
      {purchased && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-sm font-semibold text-emerald-700">
          ¡Compra realizada con éxito!
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Mis Productos</h1>
          <p className="mt-1 text-sm text-gray-500">Artículos que tienes en venta</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-gray-100 border border-gray-200 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">
            {serialized.length} {serialized.length === 1 ? "artículo" : "artículos"}
          </span>
          <Link
            href="/agregar-producto"
            className="flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition"
          >
            <PlusCircle size={15} />
            Publicar
          </Link>
        </div>
      </div>

      {serialized.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 border border-gray-200">
            <Package size={28} className="text-gray-400" />
          </div>
          <p className="font-semibold text-gray-700">Aún no tienes productos en venta</p>
          <p className="mt-1 text-sm text-gray-400">Publica tu primer artículo y empieza a vender</p>
          <Link
            href="/agregar-producto"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition"
          >
            <PlusCircle size={15} />
            Publicar producto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {serialized.map((p) => (
            <div key={p.idproducto} className="relative group">
              <ProductCard {...p} hideVerMas />
              <Link
                href={`/editar-producto/${p.idproducto}`}
                className="absolute bottom-3.5 right-4 z-10 rounded-full bg-violet-600 border border-violet-700 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-violet-700"
              >
                Editar
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
