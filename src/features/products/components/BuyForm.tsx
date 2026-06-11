"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
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

export default function BuyForm({ idproducto, precio, stock }: Props) {
  const router = useRouter()
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([])
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateTransactionInput>({
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

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null)
    setLoading(true)
    const result = await createTransactionAction(data)
    if (result?.error) {
      setServerError(result.error)
      setLoading(false)
    } else {
      router.push("/profile?purchased=true")
    }
  })

  return (
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
          Método de pago
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
        <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">Total a pagar</p>
        <p className="text-2xl text-[#FF6B00] font-black">
          ${precioTotal.toLocaleString('es-MX')}
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
        {loading ? "PROCESANDO..." : "COMPRAR"}
      </button>

    </form>
  )
}