import { prisma } from "@/server/db/db"

export async function getMetodosPago() {
  return prisma.metodoPago.findMany()
}

export async function createTransaction(data: {
  idcomprador: number
  idvendedor: number
  idproducto: number
  idmetodopago: number
  cantidad: number
  preciototal: number
}) {
  return prisma.transaccion.create({
    // idcomunidad cast until `prisma migrate dev` regenerates types with the nullable field
    data: {
      idcomprador: data.idcomprador,
      idvendedor: data.idvendedor,
      idproducto: data.idproducto,
      idmetodopago: data.idmetodopago,
      idestado: 1,
      cantidad: data.cantidad,
      preciototal: data.preciototal,
      fechatransaccion: new Date(),
      isactive: 1,
    } as never
  })
}

export async function getTransactionsByUser(idcomprador: number) {
  return prisma.transaccion.findMany({
    where: { idcomprador, isactive: 1 },
    include: {
      producto: { select: { nombreproducto: true, fotoproducto: true, fotourl: true, idproducto: true } },
      metodopago: { select: { nombremetodopago: true } },
      estado: { select: { estado: true } },
      vendedor: { select: { nombre: true, telefono: true } },
    },
    orderBy: { fechatransaccion: "desc" }
  })
}

export async function getSalesByUser(idvendedor: number) {
  return prisma.transaccion.findMany({
    where: {
      idvendedor,
      isactive: 1,
      idestado: { in: [1, 2] }
    },
    include: {
      producto: { select: { nombreproducto: true, fotoproducto: true, fotourl: true, idproducto: true } },
      metodopago: { select: { nombremetodopago: true } },
      estado: { select: { estado: true } },
      comprador: { select: { nombre: true, telefono: true } },
    },
    orderBy: { fechatransaccion: "desc" }
  })
}

export async function getTransactionById(idtransaccion: number) {
  return prisma.transaccion.findUnique({
    where: { idtransaccion },
    select: { idtransaccion: true, idvendedor: true, idcomprador: true, cantidad: true, idproducto: true }
  })
}

export async function updateTransactionStatus(idtransaccion: number, idestado: number) {
  const transaction = await prisma.transaccion.findUnique({
    where: { idtransaccion },
    select: { cantidad: true, idproducto: true }
  })

  if (!transaction) return null

  // Si se marca como completada (vendida), reducir el stock del producto
  if (idestado === 2) {
    await prisma.producto.update({
      where: { idproducto: transaction.idproducto },
      data: { stock: { decrement: transaction.cantidad } }
    })
  }

  return prisma.transaccion.update({
    where: { idtransaccion },
    data: { idestado }
  })
}