import { prisma } from "@/server/db/db"

export async function getComunidadesAprobadasByUser(idusuario: number) {
  const rows = await prisma.membresiaComunidad.findMany({
    where: { idusuario, estado: "APROBADA" },
    select: { comunidad: { select: { idcomunidad: true, nombre: true, slug: true } } },
  })
  return rows.map((r) => r.comunidad)
}

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

export async function getMembresiaById(idmembresia: number) {
  return prisma.membresiaComunidad.findUnique({
    where: { idmembresia },
    select: { idcomunidad: true, idusuario: true, rol: true, estado: true },
  })
}

export async function getMiembrosByComunidad(idcomunidad: number) {
  return prisma.membresiaComunidad.findMany({
    where: { idcomunidad },
    include: {
      usuario: { select: { idusuario: true, nombre: true, correo: true } },
    },
    orderBy: { fechacreacion: "asc" },
  })
}

export async function setRolComunidad(idmembresia: number, rol: "ADMIN" | "USER") {
  await prisma.membresiaComunidad.update({
    where: { idmembresia },
    data: { rol },
  })
  return { ok: true }
}

export async function addMiembroDirecto(
  idusuario: number,
  idcomunidad: number,
  rol: "ADMIN" | "USER",
) {
  const existing = await getMembresiaByUserAndComunidad(idusuario, idcomunidad)
  if (existing) {
    await prisma.membresiaComunidad.update({
      where: { idmembresia: existing.idmembresia },
      data: { estado: "APROBADA", rol },
    })
  } else {
    await prisma.membresiaComunidad.create({
      data: { idusuario, idcomunidad, rol, estado: "APROBADA" },
    })
  }
  return { ok: true }
}

export async function removeMiembro(idmembresia: number) {
  await prisma.membresiaComunidad.delete({ where: { idmembresia } })
  return { ok: true }
}

export async function updateMembresiaEstado(
  idmembresia: number,
  estado: "APROBADA" | "RECHAZADA" | "BLOQUEADA" | "PENDIENTE",
) {
  await prisma.membresiaComunidad.update({
    where: { idmembresia },
    data: { estado },
  })
  return { ok: true }
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
