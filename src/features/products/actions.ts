"use server"

import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createTransaction, getMetodosPago, updateTransactionStatus, getTransactionById } from "@/server/services/transactionService"
import { getProductById, createProduct, getProductForEdit, updateProduct, upsertPublicacion } from "@/server/services/productService"
import { getMembresiaByUserAndComunidad } from "@/server/services/membresiaService"
import { createTransactionSchema, CreateTransactionInput } from "@/types/transaction.types"
import type { CreateProductDTO } from "@/types/product.types"

export async function createProductAction(data: CreateProductDTO) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  try {
    const product = await createProduct(data)
    return { id: product.idproducto }
  } catch (error) {
    console.error("[createProduct] Error:", error)
    return { error: "Error al publicar el producto" }
  }
}

export async function updateProductAction(
  idproducto: number,
  data: {
    nombreproducto: string
    descripcion: string
    idcategoria: number
    iddisponibilidad: number
    precio: number
    stock: number
    imageUrl?: string
  },
) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const producto = await getProductForEdit(idproducto)
  if (!producto) return { error: "Producto no encontrado" }
  if (producto.idusuario !== Number(session.user.id)) return { error: "No tienes permiso para editar este producto" }

  try {
    await updateProduct(idproducto, data)
    revalidatePath("/profile")
    return { ok: true }
  } catch {
    return { error: "Error al actualizar el producto" }
  }
}

export async function publishToComAction(idproducto: number, idcomunidad: number) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const producto = await getProductForEdit(idproducto)
  if (!producto) return { error: "Producto no encontrado" }
  if (producto.idusuario !== Number(session.user.id)) return { error: "No tienes permiso" }

  const membresia = await getMembresiaByUserAndComunidad(Number(session.user.id), idcomunidad)
  if (!membresia || membresia.estado !== "APROBADA") return { error: "No eres miembro de esta comunidad" }

  await upsertPublicacion(idproducto, idcomunidad, 1)
  revalidatePath("/comunidad", "layout")
  return { ok: true }
}

export async function unpublishFromComAction(idproducto: number, idcomunidad: number) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const producto = await getProductForEdit(idproducto)
  if (!producto) return { error: "Producto no encontrado" }
  if (producto.idusuario !== Number(session.user.id)) return { error: "No tienes permiso" }

  await upsertPublicacion(idproducto, idcomunidad, 0)
  revalidatePath("/comunidad", "layout")
  return { ok: true }
}

export async function getMetodosPagoAction() {
  return getMetodosPago()
}

export async function createTransactionAction(data: CreateTransactionInput) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const parsed = createTransactionSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const producto = await getProductById(parsed.data.idproducto)
  if (!producto) return { error: "Producto no encontrado" }

  if (parsed.data.cantidad > producto.stock) {
    return { error: `Solo hay ${producto.stock} disponibles` }
  }

  if (Number(session.user.id) === producto.idusuario) {
    return { error: "No puedes comprar tu propio producto" }
  }

  const preciototal = Number(producto.precio) * parsed.data.cantidad

  const result = await createTransaction({
    idcomprador: Number(session.user.id),
    idvendedor: producto.idusuario,
    idproducto: parsed.data.idproducto,
    idmetodopago: parsed.data.idmetodopago,
    cantidad: parsed.data.cantidad,
    preciototal,
  })

  if (!result) return { error: "No se pudo procesar la solicitud" }

  return { success: true, telefonoVendedor: producto.vendedor.telefono }
}

export async function updateTransactionStatusAction(idtransaccion: number, idestado: number) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  if (![1, 2, 3].includes(idestado)) {
    return { error: "Estado no válido" }
  }

  const transaction = await getTransactionById(idtransaccion)
  if (!transaction) return { error: "Transacción no encontrada" }

  const userId = Number(session.user.id)
  if (userId !== transaction.idvendedor && userId !== transaction.idcomprador) {
    return { error: "No tienes permisos para esta acción" }
  }

  // Solo el vendedor puede marcar como completado (estado 2)
  if (idestado === 2 && userId !== transaction.idvendedor) {
    return { error: "Solo el vendedor puede completar la venta" }
  }

  const result = await updateTransactionStatus(idtransaccion, idestado)
  if (!result) return { error: "No se pudo actualizar el estado" }

  return { success: true }
}