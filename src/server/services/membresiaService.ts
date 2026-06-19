import { prisma } from "@/server/db/db"

export async function getMembresiasByUser(idusuario: number) {
  return prisma.membresiaComunidad.findMany({
    where: { idusuario },
    include: {
      comunidad: {
        select: {
          idcomunidad: true,
          nombre: true,
          descripcion: true,
          slug: true,
          _count: { select: { miembros: { where: { estado: "APROBADA" } } } },
        },
      },
    },
    orderBy: { fechacreacion: "desc" },
  })
}

export async function getMembresiaByUserAndComunidad(idusuario: number, idcomunidad: number) {
  return prisma.membresiaComunidad.findUnique({
    where: { idusuario_idcomunidad: { idusuario, idcomunidad } },
  })
}

export async function solicitarUnirse(idusuario: number, idcomunidad: number) {
  const existing = await getMembresiaByUserAndComunidad(idusuario, idcomunidad)

  if (existing) {
    if (existing.estado === "APROBADA") return { error: "Ya eres miembro de esta comunidad" }
    if (existing.estado === "PENDIENTE") return { error: "Ya tienes una solicitud pendiente" }
    if (existing.estado === "BLOQUEADA") return { error: "No puedes unirte a esta comunidad" }
    // RECHAZADA → allow re-request
    await prisma.membresiaComunidad.update({
      where: { idmembresia: existing.idmembresia },
      data: { estado: "PENDIENTE" },
    })
    return { ok: true }
  }

  await prisma.membresiaComunidad.create({
    data: { idusuario, idcomunidad, rol: "USER", estado: "PENDIENTE" },
  })
  return { ok: true }
}
