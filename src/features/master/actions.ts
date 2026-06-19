"use server"

import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { getComunidades, createComunidad, updateComunidad, generateInviteCode, revokeInviteCode } from "@/server/services/comunidadService"
import { getMiembrosByComunidad, setRolComunidad, addMiembroDirecto, removeMiembro } from "@/server/services/membresiaService"
import { getAllUsuarios, createUserByMaster, getUserById, updateUser } from "@/server/services/userService"
import { prisma } from "@/server/db/db"
import { UpdateUserAdminInput } from "@/types/auth.types"
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

const editComunidadSchema = z.object({
  idcomunidad: z.number(),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  descripcion: z.string().max(500, "La descripción no puede tener más de 500 caracteres").optional(),
})

export type EditComunidadInput = z.infer<typeof editComunidadSchema>

export async function updateComunidadAction(data: EditComunidadInput) {
  await requireMaster()
  const parsed = editComunidadSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  return updateComunidad(parsed.data.idcomunidad, {
    nombre: parsed.data.nombre,
    descripcion: parsed.data.descripcion,
  })
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

const updateUsuarioSchema = z.object({
  idusuario: z.number(),
  rolapp: z.enum(["MASTER", "USER"]).optional(),
  isactive: z.number().optional(),
})

export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>

export async function updateUsuarioAction(data: UpdateUsuarioInput) {
  await requireMaster()
  const parsed = updateUsuarioSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await updateUser(parsed.data.idusuario, {
    rolapp: parsed.data.rolapp,
    isactive: parsed.data.isactive,
  } as UpdateUserAdminInput)

  return { ok: true }
}

export type CreateUserMasterInput = z.infer<typeof createUserMasterSchema>

export async function createUserMasterAction(data: CreateUserMasterInput) {
  await requireMaster()
  const parsed = createUserMasterSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  return createUserByMaster(parsed.data)
}

// --- Miembros de comunidad ---

export async function getMiembrosComunidadAction(idcomunidad: number) {
  await requireMaster()
  return getMiembrosByComunidad(idcomunidad)
}

export async function setRolComunidadAction(idmembresia: number, rol: "ADMIN" | "USER") {
  await requireMaster()
  return setRolComunidad(idmembresia, rol)
}

export async function addMiembroDirectoAction(idusuario: number, idcomunidad: number, rol: "ADMIN" | "USER") {
  await requireMaster()
  return addMiembroDirecto(idusuario, idcomunidad, rol)
}

export async function removeMiembroAction(idmembresia: number) {
  await requireMaster()
  return removeMiembro(idmembresia)
}

// --- Códigos de invitación ---

export async function generateInviteCodeAction(idcomunidad: number, horas: number) {
  await requireMaster()
  // cast until `prisma migrate dev` regenerates types with the new nullable fields
  const result = await generateInviteCode(idcomunidad, horas) as unknown as {
    codigoinvitacion: string | null
    codigoexpiracion: Date | null
  }
  return {
    codigoinvitacion: result.codigoinvitacion,
    codigoexpiracion: result.codigoexpiracion?.toISOString() ?? null,
  }
}

export async function revokeInviteCodeAction(idcomunidad: number) {
  await requireMaster()
  return revokeInviteCode(idcomunidad)
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
