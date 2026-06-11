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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto w-full p-6">

        {/* Mensajes */}
        {updated && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm text-center font-semibold border border-green-100 mb-6">
            Perfil actualizado. Los cambios de nombre se verán al cerrar sesión y volver a entrar.
          </div>
        )}
        {purchased && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm text-center font-semibold border border-green-100 mb-6">
            ¡Compra realizada con éxito!
          </div>
        )}

        {/* Info del usuario */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-[#FF6B00] font-black text-sm uppercase tracking-widest mb-1">
                Estudiante de la Anahuac Cancun
              </p>
              <h1 className="text-4xl font-extrabold text-gray-800">
                {session?.user?.name || "Francisco García"}
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/agregar-producto"
                className="px-6 py-3 bg-[#FF6B00] text-white font-bold rounded-xl hover:bg-[#e66000] transition-all shadow-lg shadow-orange-200"
              >
                AGREGAR PRODUCTO
              </Link>
              <Link
                href={`/editar-perfil/${session?.user?.id}`}
                className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-[#FF6B00] hover:text-[#FF6B00] transition-all"
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
            <div className="text-center py-10">
              <p className="text-gray-400">No has realizado ninguna compra aún.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {transactionsSerialized.map((t) => (
                <div
                  key={t.idtransaccion}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center gap-4"
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
                    <p className="font-black text-gray-800">{t.producto.nombreproducto}</p>
                    <p className="text-sm text-gray-400">Vendedor: {t.vendedor.nombre}</p>
                    <p className="text-sm text-gray-400">Teléfono: {t.vendedor.telefono}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(t.fechatransaccion).toLocaleDateString('es-MX', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <p className="text-[#FF6B00] font-black text-lg">
                      ${Number(t.preciototal).toLocaleString('es-MX')}
                    </p>
                    <p className="text-xs text-gray-400">Cantidad: {t.cantidad}</p>
                    <p className="text-xs text-gray-400">{t.metodopago.nombremetodopago}</p>
                    <span className="bg-orange-100 text-[#FF6B00] px-3 py-1 rounded-full text-xs font-bold">
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