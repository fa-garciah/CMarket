"use server"

import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { getComunidadByCodigoInvitacion } from "@/server/services/comunidadService"
import { solicitarUnirse } from "@/server/services/membresiaService"

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
