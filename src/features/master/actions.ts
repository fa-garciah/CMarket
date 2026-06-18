"use server"

import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { getComunidades, createComunidad, updateComunidad } from "@/server/services/comunidadService"
import { getAllUsuarios, createUserByMaster, getUserById, updateUser } from "@/server/services/userService"
import { prisma } from "@/server/db/db"
import z from "zod"

async function requireMaster() {
  const session = await auth()
  if (!session || session.user.rolapp !== "MASTER") redirect("/")
  return session
}

// --- Comunidades ---

export async function getComunidadesAction() {
  await requireMaster()
  return getComunidades()
}

const createComunidadSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  descripcion: z.string().optional(),
  idadmin: z.number().optional(),
})

export async function createComunidadAction(formData: { nombre: string; descripcion?: string; idadmin?: number }) {
  await requireMaster()
  const parsed = createComunidadSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  return createComunidad(parsed.data.nombre, parsed.data.descripcion, parsed.data.idadmin)
}

export async function getUsuariosListAction() {
  await requireMaster()
  return prisma.usuario.findMany({
    where: { isactive: 1, rolapp: "USER" },
    select: { idusuario: true, nombre: true, correo: true },
    orderBy: { nombre: "asc" },
  })
}

export async function toggleComunidadAction(idcomunidad: number, isactive: number) {
  await requireMaster()
  return updateComunidad(idcomunidad, { isactive })
}

// --- Usuarios ---

export async function getUsuariosAction() {
  await requireMaster()
  return getAllUsuarios()
}

const createUserMasterSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  correo: z.string().email("Correo no válido"),
  telefono: z.string().min(7, "Teléfono no válido"),
  contrasena: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe tener una mayúscula")
    .regex(/[a-z]/, "Debe tener una minúscula")
    .regex(/[0-9]/, "Debe tener un número"),
  rolapp: z.enum(["MASTER", "USER"]).default("USER"),
})

export type CreateUserMasterInput = z.infer<typeof createUserMasterSchema>

export async function createUserMasterAction(data: CreateUserMasterInput) {
  await requireMaster()
  const parsed = createUserMasterSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  return createUserByMaster(parsed.data)
}

// --- Perfil master ---

export async function getMasterProfileAction() {
  const session = await requireMaster()
  return getUserById(Number(session.user.id))
}

export async function updateMasterProfileAction(data: { nombre?: string; telefono?: string; contrasena?: string }) {
  const session = await requireMaster()
  return updateUser(Number(session.user.id), data)
}
