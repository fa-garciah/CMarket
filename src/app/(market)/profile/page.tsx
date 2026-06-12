import { auth } from "@/server/auth"
import Link from "next/link";
import { getProductsByUser } from "@/server/services/productService";
import { getTransactionsByUser, getSalesByUser } from "@/server/services/transactionService";
import ProductsGrid from '@/features/products/components/ProductsGrid';
import SalesSection from '@/features/products/components/SalesSection';

export default async function ProfilePage({
  searchParams
}: {
  searchParams: Promise<{ updated?: string, purchased?: string }>
}) {
  const { updated, purchased } = await searchParams
  const session = await auth()

  const [product, transactions, ventas] = await Promise.all([
    getProductsByUser(Number(session?.user?.id)),
    getTransactionsByUser(Number(session?.user?.id)),
    getSalesByUser(Number(session?.user?.id))
  ])

  const productosSerialized = product.map((prod) => ({
    ...prod,
    precio: Number(prod.precio),
    fotoproducto: prod.fotoproducto ? true : false,
    fechapublicacion: prod.fechapublicacion.toISOString(),
  }))

  const ventasSerialized = ventas.map((v) => ({
    ...v,
    preciototal: Number(v.preciototal),
    fechatransaccion: v.fechatransaccion.toISOString(),
    producto: {
      ...v.producto,
      fotoproducto: v.producto.fotoproducto ? true : false,
      fotourl: v.producto.fotourl ?? null,
    }
  }))

  const transactionsSerialized = transactions.map((t) => ({
    ...t,
    preciototal: Number(t.preciototal),
    fechatransaccion: t.fechatransaccion.toISOString(),
    producto: {
      ...t.producto,
      fotoproducto: t.producto.fotoproducto ? true : false,
      fotourl: t.producto.fotourl ?? null,
    }
  }))

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(1200px_700px_at_20%_-10%,#8580a8_0%,#5c5878_45%,#44405b_100%)] text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(15,23,42,0.35),transparent_42%)]" />
      <main className="relative mx-auto flex w-full max-w-7xl flex-grow flex-col p-6 sm:p-8 lg:p-10">

        {/* Mensajes */}
        {updated && (
          <div className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-500/12 p-3 text-center text-sm font-semibold text-emerald-100">
            Perfil actualizado. Los cambios de nombre se verán al cerrar sesión y volver a entrar.
          </div>
        )}
        {purchased && (
          <div className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-500/12 p-3 text-center text-sm font-semibold text-emerald-100">
            ¡Compra realizada con éxito!
          </div>
        )}

        {/* Info del usuario */}
        <section className="mb-10 rounded-[28px] border border-white/10 bg-[#231f39]/90 p-8 shadow-[0_30px_90px_rgba(10,10,30,0.35)] backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="mb-1 text-xs uppercase tracking-[0.35em] text-indigo-100/80">
                Estudiante de la Anahuac Cancun
              </p>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                {session?.user?.name || "Francisco García"}
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/agregar-producto"
                className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white shadow-[0_18px_45px_rgba(88,80,160,0.35)] transition hover:bg-indigo-400"
              >
                AGREGAR PRODUCTO
              </Link>
              <Link
                href={`/editar-perfil/${session?.user?.id}`}
                className="rounded-xl border border-white/15 bg-white/8 px-6 py-3 font-semibold text-slate-100 transition hover:border-indigo-300/60 hover:bg-white/10"
              >
                EDITAR USUARIO
              </Link>
            </div>
          </div>
        </section>

        {/* Mis productos */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
              Mis Productos en Venta
            </h2>
            <span className="bg-orange-100 text-[#FF6B00] px-4 py-1 rounded-full text-xs font-bold">
              {product?.length || 0} ARTÍCULOS
            </span>
          </div>
          <ProductsGrid
            products={productosSerialized}
            userName={session?.user?.name}
          />
        </section>

        {/* Ventas y historial de ventas */}
        <section className="mb-10">
          <SalesSection ventas={ventasSerialized} />
        </section>

        {/* Historial de compras */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
              Historial de Compras
            </h2>
            <span className="bg-orange-100 text-[#FF6B00] px-4 py-1 rounded-full text-xs font-bold">
              {transactionsSerialized.length} COMPRAS
            </span>
          </div>

          {transactionsSerialized.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-white/15 bg-[#231f39]/70 py-10 text-center shadow-[0_18px_45px_rgba(10,10,30,0.25)] backdrop-blur-xl">
              <p className="text-slate-200">No has realizado ninguna compra aún.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {transactionsSerialized.map((t) => (
                <div
                  key={t.idtransaccion}
                  className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-[#231f39]/90 p-6 shadow-[0_18px_45px_rgba(10,10,30,0.25)] backdrop-blur-xl md:flex-row md:items-center"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {t.producto.fotourl ? (
                      <img
                        src={t.producto.fotourl}
                        alt={t.producto.nombreproducto}
                        className="w-full h-full object-cover"
                      />
                    ) : t.producto.fotoproducto ? (
                      <img
                        src={`/api/productos/${t.producto.idproducto}/foto`}
                        alt={t.producto.nombreproducto}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img src="/placeholder.png" alt="Sin imagen" className="w-full h-full object-cover" />
                    )}
                  </div>

                  <div className="flex-grow">
                    <p className="font-black text-white">{t.producto.nombreproducto}</p>
                    <p className="text-sm text-slate-200/90">Vendedor: {t.vendedor.nombre}</p>
                    <p className="text-sm text-slate-200/90">Teléfono: {t.vendedor.telefono}</p>
                    <p className="text-sm text-slate-200/90">
                      {new Date(t.fechatransaccion).toLocaleDateString('es-MX', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <p className="text-lg font-black text-indigo-200">
                      ${Number(t.preciototal).toLocaleString('es-MX')}
                    </p>
                    <p className="text-xs text-slate-300">Cantidad: {t.cantidad}</p>
                    <p className="text-xs text-slate-300">{t.metodopago.nombremetodopago}</p>
                    <span className="rounded-full border border-indigo-300/40 bg-indigo-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-100">
                      {t.estado.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  )
}