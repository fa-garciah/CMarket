import { getProductById } from "@/server/services/productService"
import { auth } from "@/server/auth"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import Image from "next/image"
import InteresForm from "@/features/products/components/InteresForm"

export default async function DetalleProductoPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [producto, session] = await Promise.all([
    getProductById(Number(id)),
    auth()
  ])

  if (!producto) notFound()

  const esVendedor = Number(session?.user?.id) === producto.idusuario

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </Link>

      <div className="flex flex-col gap-8 md:flex-row">

        {/* Foto */}
        <div className="w-full md:w-1/2">
          <div className="relative h-96 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm">
            {producto.fotourl ? (
              <Image src={producto.fotourl} alt={producto.nombreproducto} fill className="object-cover" />
            ) : producto.fotoproducto ? (
              <Image src={`/api/productos/${producto.idproducto}/foto`} alt={producto.nombreproducto} fill className="object-cover" />
            ) : (
              <Image src="/placeholder.png" alt="Sin imagen" fill className="object-cover" />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2">
          <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">

            {/* Vendedor */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 border border-violet-200 text-sm font-black text-violet-700">
                {producto.vendedor.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Vendedor</p>
                <p className="font-bold text-gray-900">{producto.vendedor.nombre}</p>
              </div>
            </div>

            {/* Nombre y precio */}
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 sm:text-3xl">{producto.nombreproducto}</h1>
              <p className="mt-2 text-2xl font-black text-violet-600 sm:text-3xl">
                ${Number(producto.precio).toLocaleString('es-MX')}
              </p>
            </div>

            {/* Descripción */}
            {producto.descripcion && (
              <div>
                <p className="mb-1 text-xs uppercase tracking-widest text-gray-400 font-medium">Descripción</p>
                <p className="text-sm text-gray-600 leading-relaxed">{producto.descripcion}</p>
              </div>
            )}

            {/* Stock */}
            <div>
              <p className="mb-1 text-xs uppercase tracking-widest text-gray-400 font-medium">Stock</p>
              <p className="font-semibold text-gray-700">{producto.stock} disponible(s)</p>
            </div>

            {/* Acción */}
            {!esVendedor ? (
              <InteresForm
                idproducto={producto.idproducto}
                precio={Number(producto.precio)}
                stock={producto.stock}
              />
            ) : (
              <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-center text-sm font-semibold text-violet-700">
                Este es tu producto
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  )
}
