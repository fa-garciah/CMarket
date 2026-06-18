import { auth } from "@/server/auth"
import { getTransactionsByUser, getSalesByUser } from "@/server/services/transactionService"
import SalesSection from "@/features/products/components/SalesSection"

export default async function TransaccionesPage() {
  const session = await auth()

  const [transactions, ventas] = await Promise.all([
    getTransactionsByUser(Number(session?.user?.id)),
    getSalesByUser(Number(session?.user?.id)),
  ])

  const ventasSerialized = ventas.map((v) => ({
    ...v,
    preciototal: Number(v.preciototal),
    fechatransaccion: v.fechatransaccion.toISOString(),
    producto: {
      ...v.producto,
      fotoproducto: v.producto.fotoproducto ? true : false,
      fotourl: v.producto.fotourl ?? null,
    },
  }))

  const comprasSerialized = transactions.map((t) => ({
    ...t,
    preciototal: Number(t.preciototal),
    fechatransaccion: t.fechatransaccion.toISOString(),
    producto: {
      ...t.producto,
      fotoproducto: t.producto.fotoproducto ? true : false,
      fotourl: t.producto.fotourl ?? null,
    },
  }))

  return (
    <div className="mx-auto w-full max-w-4xl p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Transacciones</h1>
        <p className="mt-1 text-sm text-gray-500">Tus ventas y compras</p>
      </div>

      {/* Ventas */}
      <section className="mb-12">
        <SalesSection ventas={ventasSerialized} />
      </section>

      {/* Compras */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Historial de Compras</h2>
          <span className="bg-violet-50 text-violet-700 border border-violet-200 px-3 py-0.5 rounded-full text-xs font-bold">
            {comprasSerialized.length} compras
          </span>
        </div>

        {comprasSerialized.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-8 text-center shadow-sm">
            <p className="text-sm text-gray-400">No has realizado ninguna compra aún.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {comprasSerialized.map((t) => (
              <div
                key={t.idtransaccion}
                className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {t.producto.fotourl ? (
                    <img src={t.producto.fotourl} alt={t.producto.nombreproducto} className="w-full h-full object-cover" />
                  ) : t.producto.fotoproducto ? (
                    <img src={`/api/productos/${t.producto.idproducto}/foto`} alt={t.producto.nombreproducto} className="w-full h-full object-cover" />
                  ) : (
                    <img src="/placeholder.png" alt="Sin imagen" className="w-full h-full object-cover" />
                  )}
                </div>

                <div className="grow">
                  <p className="font-bold text-gray-900">{t.producto.nombreproducto}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Vendedor: {t.vendedor.nombre} · {t.vendedor.telefono}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(t.fechatransaccion).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="text-base font-black text-violet-600">${Number(t.preciototal).toLocaleString('es-MX')}</p>
                  <p className="text-xs text-gray-400">Cant. {t.cantidad} · {t.metodopago.nombremetodopago}</p>
                  <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-0.5 text-xs font-semibold text-violet-700">
                    {t.estado.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
