import z from "zod"

export const createTransactionSchema = z.object({
  idproducto: z.number().min(1),
  idmetodopago: z.number().min(1, "Selecciona un método de pago"),
  cantidad: z.number().min(1, "La cantidad debe ser mayor a 0"),
})

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>