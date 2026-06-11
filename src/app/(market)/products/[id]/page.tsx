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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10">

        <Link
          href="/"
          className="flex items-center gap-2 text-gray-500 hover:text-[#FF6B00] transition-colors text-sm mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al listado
        </Link>

        <div className="flex flex-col md:flex-row gap-10">

          {/* Foto */}
          <div className="w-full md:w-1/2">
            <div className="rounded-2xl overflow-hidden bg-gray-100 h-96 relative">
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-6">

              {/* Vendedor */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-lg">
                  {producto.vendedor.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Vendedor</p>
                  <p className="font-bold text-gray-800">{producto.vendedor.nombre}</p>
                </div>
              </div>

              {/* Nombre y precio */}
              <div>
                <h1 className="text-3xl font-black text-gray-800 uppercase">{producto.nombreproducto}</h1>
                <p className="text-3xl text-[#FF6B00] font-black mt-2">
                  ${Number(producto.precio).toLocaleString('es-MX')}
                </p>
              </div>

              {/* Descripción */}
              {producto.descripcion && (
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">Descripción</p>
                  <p className="text-gray-700 text-sm">{producto.descripcion}</p>
                </div>
              )}

              {/* Stock */}
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">Stock</p>
                <p className="text-gray-800 font-semibold">{producto.stock} disponible(s)</p>
              </div>

              {/* Formulario o mensaje */}
              {!esVendedor ? (
                <InteresForm
                  idproducto={producto.idproducto}
                  precio={Number(producto.precio)}
                  stock={producto.stock}
                />
              ) : (
                <div className="bg-orange-50 text-[#FF6B00] p-3 rounded-xl text-sm text-center font-semibold border border-orange-100">
                  Este es tu producto
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}