"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { getMetodosPagoAction, createTransactionAction } from "@/features/products/actions"
import { CreateTransactionInput } from "@/types/transaction.types"

type MetodoPago = {
  idmetodopago: number
  nombremetodopago: string
}

type Props = {
  idproducto: number
  precio: number
  stock: number
}

export default function InteresForm({ idproducto, precio, stock }: Props) {
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([])
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [telefonoVendedor, setTelefonoVendedor] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const { register, handleSubmit, watch, formState: { errors }, getValues } = useForm<CreateTransactionInput>({
    defaultValues: {
      idproducto,
      cantidad: 1,
      idmetodopago: 0
    }
  })

  const cantidad = watch("cantidad")
  const precioTotal = precio * (cantidad || 0)

  useEffect(() => {
    getMetodosPagoAction().then(setMetodosPago)
  }, [])

  const onSubmit = handleSubmit(() => {
    setShowModal(true)
  })

  const handleConfirm = async () => {
    setShowModal(false)
    setServerError(null)
    setLoading(true)
    const data = getValues()
    const result = await createTransactionAction(data)
    if (result?.error) {
      setServerError(result.error)
      setLoading(false)
    } else {
      setSubmitted(true)
      setTelefonoVendedor(result.telefonoVendedor || null)
      setLoading(false)
    }
  }

  if (submitted && telefonoVendedor) {
    return (
      <div className="bg-green-50 text-green-600 p-4 rounded-xl text-center font-semibold border border-green-100">
        <p>¡Solicitud enviada!</p>
        <p>Teléfono del vendedor: {telefonoVendedor}</p>
        <p>Contacta al vendedor para coordinar la entrega.</p>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-6">

      {/* Cantidad */}
      <div>
        <label className="block text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">
          Cantidad
        </label>
        <input
          type="number"
          min={1}
          max={stock}
          {...register("cantidad", {
            valueAsNumber: true,
            min: { value: 1, message: "Mínimo 1" },
            max: { value: stock, message: `Máximo ${stock}` }
          })}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#FF6B00] outline-none transition-all text-gray-700"
        />
        {errors.cantidad && (
          <p className="text-red-500 text-xs mt-1">{errors.cantidad.message}</p>
        )}
      </div>

      {/* Método de pago */}
      <div>
        <label className="block text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">
          Método de pago preferido
        </label>
        <select
          {...register("idmetodopago", {
            valueAsNumber: true,
            validate: (v) => v > 0 || "Selecciona un método de pago"
          })}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#FF6B00] outline-none transition-all text-gray-700"
        >
          <option value={0}>Selecciona un método de pago</option>
          {metodosPago.map((m) => (
            <option key={m.idmetodopago} value={m.idmetodopago}>
              {m.nombremetodopago}
            </option>
          ))}
        </select>
        {errors.idmetodopago && (
          <p className="text-red-500 text-xs mt-1">{errors.idmetodopago.message}</p>
        )}
      </div>

      {/* Precio total */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">Precio por unidad</p>
        <p className="text-2xl text-[#FF6B00] font-black">
          ${precio.toLocaleString('es-MX')}
        </p>
      </div>

      {serverError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-semibold border border-red-100">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#FF6B00] hover:bg-[#e66000] text-white font-black rounded-xl transition-all shadow-xl disabled:opacity-50"
      >
        {loading ? "ENVIANDO SOLICITUD..." : "CONTACTAR VENDEDOR"}
      </button>

    </form>

    {/* Modal de confirmación */}
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-black text-gray-800 mb-4">Confirmar Interés</h3>
          <p className="text-gray-600 mb-4">
            Al confirmar, se notificará al vendedor y se te mostrará su contacto para coordinar la entrega.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-600">Cantidad: {cantidad}</p>
            <p className="text-sm text-gray-600">Método de pago: {metodosPago.find(m => m.idmetodopago === getValues("idmetodopago"))?.nombremetodopago || "No seleccionado"}</p>
            <p className="text-sm text-gray-600">Precio por unidad: ${precio.toLocaleString('es-MX')}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-3 bg-[#FF6B00] hover:bg-[#e66000] text-white font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}