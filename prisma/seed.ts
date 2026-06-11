import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.categoria.createMany({
    data: [
      { idcategoria: 1, nombrecategoria: "Comida" },
      { idcategoria: 2, nombrecategoria: "Eventos" },
      { idcategoria: 3, nombrecategoria: "Tecnologia" },
      { idcategoria: 4, nombrecategoria: "Hogar" },
      { idcategoria: 5, nombrecategoria: "Servicios" },
      { idcategoria: 6, nombrecategoria: "Ropa" },
      { idcategoria: 7, nombrecategoria: "Otros" },
    ],
    skipDuplicates: true,
  })

  await prisma.disponibilidad.createMany({
    data: [
      { iddisponibilidad: 1, nombredisponibilidad: "Disponible" },
      { iddisponibilidad: 2, nombredisponibilidad: "Agotado" },
    ],
    skipDuplicates: true,
  })

  await prisma.metodoPago.createMany({
    data: [
      { idmetodopago: 1, nombremetodopago: "N/A" },
      { idmetodopago: 2, nombremetodopago: "Tarjeta" },
      { idmetodopago: 3, nombremetodopago: "Efectivo" },
    ],
    skipDuplicates: true,
  })

  await prisma.estadoTransaccion.createMany({
    data: [
      { idestado: 1, estado: "En Proceso" },
      { idestado: 2, estado: "Completado" },
      { idestado: 3, estado: "Rechazada" },
    ],
    skipDuplicates: true,
  })

  console.log("Seed completado")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
