import { prisma } from "@/server/db/db"

function generateSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

export async function getComunidades() {
  return prisma.comunidad.findMany({
    orderBy: { fechacreacion: "desc" },
    include: {
      _count: { select: { miembros: true, publicaciones: true } },
    },
  })
}

export async function getComunidadBySlug(slug: string) {
  return prisma.comunidad.findUnique({
    where: { slug },
    include: { _count: { select: { miembros: true } } },
  })
}

export async function createComunidad(nombre: string, descripcion?: string, idadmin?: number) {
  const slug = generateSlug(nombre)

  const existe = await prisma.comunidad.findUnique({ where: { slug } })
  if (existe) return { error: "Ya existe una comunidad con ese nombre" }

  const comunidad = await prisma.comunidad.create({
    data: { nombre, slug, descripcion },
  })

  if (idadmin) {
    await prisma.membresiaComunidad.create({
      data: {
        idusuario: idadmin,
        idcomunidad: comunidad.idcomunidad,
        rol: "ADMIN",
        estado: "APROBADA",
      },
    })
  }

  return { ok: true, comunidad }
}

export async function updateComunidad(
  idcomunidad: number,
  data: { nombre?: string; descripcion?: string; isactive?: number }
) {
  await prisma.comunidad.update({ where: { idcomunidad }, data })
  return { ok: true }
}
