import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

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

  const masterPassword = await bcrypt.hash("Master123", 12)
  await prisma.usuario.upsert({
    where: { correo: "master@cmarket.com" },
    update: {},
    create: {
      nombre: "Master Admin",
      correo: "master@cmarket.com",
      telefono: "+52 000 000 0000",
      contrasena: masterPassword,
      rolapp: "MASTER",
      isactive: 1,
    },
  })

  console.log("Seed completado")
  console.log("Master: master@cmarket.com / Master123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
