"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateTransactionStatusAction } from "@/features/products/actions"
import { Check, X } from "lucide-react"

type Transaccion = {
  idtransaccion: number
  cantidad: number
  preciototal: number
  fechatransaccion: string
  idestado: number
  producto: { nombreproducto: string, fotoproducto: boolean, fotourl: string | null, idproducto: number }
  metodopago: { nombremetodopago: string }
  estado: { estado: string }
  comprador: { nombre: string, telefono: string }
}

type Props = {
  ventas: Transaccion[]
}

function ProductThumb({ producto }: { producto: Transaccion["producto"] }) {
  if (producto.fotourl) {
    return <img src={producto.fotourl} alt={producto.nombreproducto} className="w-full h-full object-cover" />
  }
  if (producto.fotoproducto) {
    return <img src={`/api/productos/${producto.idproducto}/foto`} alt={producto.nombreproducto} className="w-full h-full object-cover" />
  }
  return <img src="/placeholder.png" alt="Sin imagen" className="w-full h-full object-cover" />
}

export default function SalesSection({ ventas }: Props) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const ventasPendientes = ventas.filter(v => v.idestado === 1)
  const ventasCompletadas = ventas.filter(v => v.idestado === 2)

  async function handleUpdateStatus(idtransaccion: number, idestado: number) {
    setLoadingId(idtransaccion)
    setError(null)
    const result = await updateTransactionStatusAction(idtransaccion, idestado)
    if (result?.error) {
      setError(result.error)
    } else {
      router.refresh()
    }
    setLoadingId(null)
  }

  const cardClass = "flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center"

  return (
    <div className="flex flex-col gap-10">

      {/* Interesados */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-black text-gray-900 uppercase tracking-tight sm:text-xl">Interesados</h2>
          <span className="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-0.5 rounded-full text-xs font-bold">
            {ventasPendientes.length} pendientes
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {ventasPendientes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-8 text-center shadow-sm">
            <p className="text-sm text-gray-400">No tienes ventas pendientes.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {ventasPendientes.map((v) => (
              <div key={v.idtransaccion} className={cardClass}>
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <ProductThumb producto={v.producto} />
                </div>
                <div className="grow">
                  <p className="font-bold text-gray-900">{v.producto.nombreproducto}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Comprador: {v.comprador.nombre} · {v.comprador.telefono}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(v.fechatransaccion).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <p className="text-base font-black text-violet-600">${Number(v.preciototal).toLocaleString('es-MX')}</p>
                  <p className="text-xs text-gray-400">Cant. {v.cantidad} · {v.metodopago.nombremetodopago}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleUpdateStatus(v.idtransaccion, 2)}
                    disabled={loadingId === v.idtransaccion}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                  >
                    <Check size={13} />
                    Vendido
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(v.idtransaccion, 3)}
                    disabled={loadingId === v.idtransaccion}
                    className="flex items-center gap-1.5 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                  >
                    <X size={13} />
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Historial de ventas */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-black text-gray-900 uppercase tracking-tight sm:text-xl">Historial de Ventas</h2>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-0.5 rounded-full text-xs font-bold">
            {ventasCompletadas.length} completadas
          </span>
        </div>

        {ventasCompletadas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-8 text-center shadow-sm">
            <p className="text-sm text-gray-400">No tienes ventas completadas aún.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {ventasCompletadas.map((v) => (
              <div key={v.idtransaccion} className={cardClass}>
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <ProductThumb producto={v.producto} />
                </div>
                <div className="grow">
                  <p className="font-bold text-gray-900">{v.producto.nombreproducto}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Comprador: {v.comprador.nombre} · {v.comprador.telefono}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(v.fechatransaccion).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="text-base font-black text-violet-600">${Number(v.preciototal).toLocaleString('es-MX')}</p>
                  <p className="text-xs text-gray-400">Cant. {v.cantidad} · {v.metodopago.nombremetodopago}</p>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700">
                    Completada
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
