import { prisma } from "@/server/db/db";

function generateSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function getComunidades() {
  return prisma.comunidad.findMany({
    orderBy: { fechacreacion: "desc" },
    include: {
      _count: { select: { miembros: true, publicaciones: true } },
    },
  });
}

export async function getComunidadBySlug(slug: string) {
  return prisma.comunidad.findUnique({
    where: { slug },
    include: { _count: { select: { miembros: true } } },
  });
}

export async function createComunidad(
  nombre: string,
  descripcion?: string,
  idadmin?: number,
) {
  const slug = generateSlug(nombre);

  const existe = await prisma.comunidad.findUnique({ where: { slug } });
  if (existe) return { error: "Ya existe una comunidad con ese nombre" };

  const comunidad = await prisma.comunidad.create({
    data: { nombre, slug, descripcion },
  });

  if (idadmin) {
    await prisma.membresiaComunidad.create({
      data: {
        idusuario: idadmin,
        idcomunidad: comunidad.idcomunidad,
        rol: "ADMIN",
        estado: "APROBADA",
      },
    });
  }

  return { ok: true, comunidad };
}

export async function updateComunidad(
  idcomunidad: number,
  data: { nombre?: string; descripcion?: string; isactive?: number },
) {
  await prisma.comunidad.update({ where: { idcomunidad }, data });
  return { ok: true };
}

export async function generateInviteCode(idcomunidad: number, horas: number) {
  const { randomUUID } = await import("crypto");
  const codigo = randomUUID();
  const expiracion = new Date(Date.now() + horas * 60 * 60 * 1000);
  // cast until `prisma migrate dev` regenerates types with the new nullable fields
  await prisma.comunidad.update({
    where: { idcomunidad },
    data: { codigoinvitacion: codigo, codigoexpiracion: expiracion } as never,
  });
  return { codigoinvitacion: codigo, codigoexpiracion: expiracion };
}

export async function revokeInviteCode(idcomunidad: number) {
  // cast needed until `prisma migrate dev` regenerates types with the nullable fields
  await prisma.comunidad.update({
    where: { idcomunidad },
    data: { codigoinvitacion: null, codigoexpiracion: null } as never,
  });
  return { ok: true };
}

export async function getProductosByComunidad(idcomunidad: number) {
  const publicaciones = await prisma.producto.findMany({
    where: {
      isactive: 1,
      publicaciones: { some: { idcomunidad, isactive: 1 } },
      NOT: { disponibilidad: { nombredisponibilidad: "Agotado" } },
    },
    select: {
      idproducto: true,
      nombreproducto: true,
      precio: true,
      fotoproducto: true,
      fotourl: true,
      vendedor: { select: { nombre: true } },
      categoria: { select: { nombrecategoria: true } },
      disponibilidad: { select: { nombredisponibilidad: true } },
    },
    orderBy: { fechapublicacion: "desc" },
  })
  return publicaciones
    .filter((p) => p.disponibilidad.nombredisponibilidad.toLowerCase() !== "agotado")
    .map((p) => ({
      idproducto:     p.idproducto,
      nombreproducto: p.nombreproducto,
      precio:         Number(p.precio),
      fotoproducto:   !!p.fotoproducto,
      fotourl:        p.fotourl,
      vendedor:       p.vendedor,
      categoria:      p.categoria,
    }))
}

export async function getComunidadByCodigoInvitacion(codigo: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as any).comunidad.findUnique({
    where: { codigoinvitacion: codigo },
    select: {
      idcomunidad: true,
      nombre: true,
      descripcion: true,
      codigoexpiracion: true,
      isactive: true,
      _count: { select: { miembros: { where: { estado: "APROBADA" } } } },
    },
  }) as Promise<{
    idcomunidad: number; nombre: string; descripcion: string | null;
    codigoexpiracion: Date | null; isactive: number;
    _count: { miembros: number }
  } | null>
}
