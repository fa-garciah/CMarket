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
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(1200px_700px_at_20%_-10%,#8580a8_0%,#5c5878_45%,#44405b_100%)] text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(15,23,42,0.35),transparent_42%)]" />
      <main className="relative mx-auto flex w-full max-w-7xl flex-grow flex-col px-6 py-10">

        <Link
          href="/"
          className="mb-8 flex items-center gap-2 text-sm text-slate-200/95 transition-colors hover:text-indigo-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al listado
        </Link>

        <div className="flex flex-col md:flex-row gap-10">

          {/* Foto */}
          <div className="w-full md:w-1/2">
            <div className="relative h-96 overflow-hidden rounded-[28px] border border-white/10 bg-[#231f39]/90 shadow-[0_30px_90px_rgba(10,10,30,0.35)] backdrop-blur-xl">
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
            <div className="flex flex-col gap-6 rounded-[28px] border border-white/10 bg-[#231f39]/90 p-8 shadow-[0_30px_90px_rgba(10,10,30,0.35)] backdrop-blur-xl">

              {/* Vendedor */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-400/10 text-lg font-black text-indigo-100">
                  {producto.vendedor.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-indigo-100/80">Vendedor</p>
                  <p className="font-bold text-white">{producto.vendedor.nombre}</p>
                </div>
              </div>

              {/* Nombre y precio */}
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-white">{producto.nombreproducto}</h1>
                <p className="mt-2 text-3xl font-black text-indigo-200">
                  ${Number(producto.precio).toLocaleString('es-MX')}
                </p>
              </div>

              {/* Descripción */}
              {producto.descripcion && (
                <div>
                  <p className="mb-1 text-xs uppercase tracking-[0.28em] text-indigo-100/80">Descripción</p>
                  <p className="text-sm text-slate-200/95">{producto.descripcion}</p>
                </div>
              )}

              {/* Stock */}
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.28em] text-indigo-100/80">Stock</p>
                <p className="font-semibold text-slate-100">{producto.stock} disponible(s)</p>
              </div>

              {/* Formulario o mensaje */}
              {!esVendedor ? (
                <InteresForm
                  idproducto={producto.idproducto}
                  precio={Number(producto.precio)}
                  stock={producto.stock}
                />
              ) : (
                <div className="rounded-xl border border-indigo-300/40 bg-indigo-400/10 p-3 text-center text-sm font-semibold text-indigo-100">
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