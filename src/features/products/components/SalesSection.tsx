"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { updateTransactionStatusAction } from "@/features/products/actions"

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

  return (
    <div className="flex flex-col gap-10">

      {/* Ventas pendientes */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
            Interesados
          </h2>
          <span className="bg-orange-100 text-[#FF6B00] px-4 py-1 rounded-full text-xs font-bold">
            {ventasPendientes.length} INTERESADOS
          </span>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-semibold border border-red-100 mb-4">
            {error}
          </div>
        )}

        {ventasPendientes.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-white/15 bg-[#231f39]/70 py-10 text-center shadow-[0_18px_45px_rgba(10,10,30,0.25)] backdrop-blur-xl">
            <p className="text-slate-200">No tienes ventas pendientes.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {ventasPendientes.map((v) => (
              <div
                key={v.idtransaccion}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center gap-4"
              >
                {/* Foto */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
                  {v.producto.fotourl ? (
                    <Image
                      src={v.producto.fotourl}
                      alt={v.producto.nombreproducto}
                      fill
                      className="object-cover"
                    />
                  ) : v.producto.fotoproducto ? (
                    <Image
                      src={`/api/productos/${v.producto.idproducto}/foto`}
                      alt={v.producto.nombreproducto}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Image src="/placeholder.png" alt="Sin imagen" fill className="object-cover" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-grow">
                  <p className="font-black text-gray-800">{v.producto.nombreproducto}</p>
                  <p className="text-sm text-gray-400">Comprador: {v.comprador.nombre}</p>
                  <p className="text-sm text-gray-400">Teléfono: {v.comprador.telefono}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(v.fechatransaccion).toLocaleDateString('es-MX', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Detalles */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <p className="text-[#FF6B00] font-black text-lg">
                    ${Number(v.preciototal).toLocaleString('es-MX')}
                  </p>
                  <p className="text-xs text-gray-400">Cantidad: {v.cantidad}</p>
                  <p className="text-xs text-gray-400">{v.metodopago.nombremetodopago}</p>
                </div>

                {/* Botones */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleUpdateStatus(v.idtransaccion, 2)}
                    disabled={loadingId === v.idtransaccion}
                    className="rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50"
                  >
                    {loadingId === v.idtransaccion ? "..." : "✓ Marcar como Vendido"}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(v.idtransaccion, 3)}
                    disabled={loadingId === v.idtransaccion}
                    className="rounded-xl bg-rose-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:opacity-50"
                  >
                    {loadingId === v.idtransaccion ? "..." : "✗ Rechazado"}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* Historial de ventas */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
            Historial de Ventas
          </h2>
          <span className="bg-orange-100 text-[#FF6B00] px-4 py-1 rounded-full text-xs font-bold">
            {ventasCompletadas.length} COMPLETADAS
          </span>
        </div>

        {ventasCompletadas.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-white/15 bg-[#231f39]/70 py-10 text-center shadow-[0_18px_45px_rgba(10,10,30,0.25)] backdrop-blur-xl">
            <p className="text-slate-200">No tienes ventas completadas aún.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {ventasCompletadas.map((v) => (
              <div
                key={v.idtransaccion}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center gap-4"
              >
                {/* Foto */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
                  {v.producto.fotourl ? (
                    <Image
                      src={v.producto.fotourl}
                      alt={v.producto.nombreproducto}
                      fill
                      className="object-cover"
                    />
                  ) : v.producto.fotoproducto ? (
                    <Image
                      src={`/api/productos/${v.producto.idproducto}/foto`}
                      alt={v.producto.nombreproducto}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Image src="/placeholder.png" alt="Sin imagen" fill className="object-cover" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-grow">
                  <p className="font-black text-gray-800">{v.producto.nombreproducto}</p>
                  <p className="text-sm text-gray-400">Comprador: {v.comprador.nombre}</p>
                  <p className="text-sm text-gray-400">Teléfono: {v.comprador.telefono}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(v.fechatransaccion).toLocaleDateString('es-MX', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Detalles */}
                <div className="flex flex-col items-end gap-1">
                  <p className="text-[#FF6B00] font-black text-lg">
                    ${Number(v.preciototal).toLocaleString('es-MX')}
                  </p>
                  <p className="text-xs text-slate-300">Cantidad: {v.cantidad}</p>
                  <p className="text-xs text-slate-300">{v.metodopago.nombremetodopago}</p>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">
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