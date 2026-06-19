"use server"

import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import {
  getComunidadByCodigoInvitacion,
  generateInviteCode,
  revokeInviteCode,
} from "@/server/services/comunidadService"
import {
  solicitarUnirse,
  getMembresiaById,
  getMembresiaByUserAndComunidad,
  updateMembresiaEstado,
} from "@/server/services/membresiaService"

export async function solicitarUnirseAction(codigoinvitacion: string) {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.rolapp === "MASTER") return { error: "Los masters no pueden unirse a comunidades" }

  const comunidad = await getComunidadByCodigoInvitacion(codigoinvitacion) as {
    idcomunidad: number
    nombre: string
    codigoexpiracion: Date | null
    isactive: number
  } | null

  if (!comunidad) return { error: "Código de invitación inválido" }
  if (!comunidad.isactive) return { error: "Esta comunidad no está activa" }
  if (!comunidad.codigoexpiracion || new Date(comunidad.codigoexpiracion) < new Date()) {
    return { error: "El código de invitación ha expirado" }
  }

  return solicitarUnirse(Number(session.user.id), comunidad.idcomunidad)
}

export async function updateMembresiaEstadoAction(
  idmembresia: number,
  estado: "APROBADA" | "RECHAZADA" | "BLOQUEADA" | "PENDIENTE",
) {
  const session = await auth()
  if (!session) redirect("/login")

  const membresia = await getMembresiaById(idmembresia)
  if (!membresia) return { error: "Membresía no encontrada" }

  const miAdmin = await getMembresiaByUserAndComunidad(
    Number(session.user.id),
    membresia.idcomunidad,
  )
  if (!miAdmin || miAdmin.rol !== "ADMIN" || miAdmin.estado !== "APROBADA") {
    return { error: "No tienes permisos para gestionar esta comunidad" }
  }

  return updateMembresiaEstado(idmembresia, estado)
}

async function requireComunidadAdmin(idcomunidad: number) {
  const session = await auth()
  if (!session) redirect("/login")
  const membresia = await getMembresiaByUserAndComunidad(Number(session.user.id), idcomunidad)
  if (!membresia || membresia.rol !== "ADMIN" || membresia.estado !== "APROBADA") {
    return { error: "No tienes permisos de administrador en esta comunidad" }
  }
  return null
}

export async function generateComunidadInviteCodeAction(idcomunidad: number, horas: number) {
  const err = await requireComunidadAdmin(idcomunidad)
  if (err) return err as { error: string }
  const result = await generateInviteCode(idcomunidad, horas)
  return {
    codigoinvitacion: result.codigoinvitacion,
    codigoexpiracion: result.codigoexpiracion?.toISOString() ?? null,
  }
}

export async function revokeComunidadInviteCodeAction(idcomunidad: number) {
  const err = await requireComunidadAdmin(idcomunidad)
  if (err) return err as { error: string }
  return revokeInviteCode(idcomunidad)
}
