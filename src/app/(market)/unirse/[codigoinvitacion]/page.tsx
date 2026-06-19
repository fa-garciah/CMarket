import { auth } from "@/server/auth"
import { getComunidadByCodigoInvitacion } from "@/server/services/comunidadService"
import { getMembresiaByUserAndComunidad } from "@/server/services/membresiaService"
import { Building2, Clock, ShieldX, CheckCircle2, Users } from "lucide-react"
import JoinButton from "./JoinButton"

type Props = { params: Promise<{ codigoinvitacion: string }> }

export default async function UnirsePage({ params }: Props) {
  const { codigoinvitacion } = await params
  const session = await auth()

  const comunidad = await getComunidadByCodigoInvitacion(codigoinvitacion) as {
    idcomunidad: number
    nombre: string
    descripcion: string | null
    codigoexpiracion: Date | null
    isactive: number
    _count: { miembros: number }
  } | null

  if (!comunidad || !comunidad.isactive) {
    return (
      <PageWrapper>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 border border-red-100 mx-auto mb-4">
          <ShieldX size={28} className="text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Código inválido</h1>
        <p className="text-gray-500 text-sm">Este enlace de invitación no es válido o la comunidad no existe.</p>
      </PageWrapper>
    )
  }

  const isExpired = !comunidad.codigoexpiracion || new Date(comunidad.codigoexpiracion) < new Date()

  if (isExpired) {
    return (
      <PageWrapper>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100 mx-auto mb-4">
          <Clock size={28} className="text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Código expirado</h1>
        <p className="text-gray-500 text-sm">
          Este enlace de invitación ha expirado. Pide al administrador de{" "}
          <span className="font-semibold text-gray-700">{comunidad.nombre}</span> que genere uno nuevo.
        </p>
      </PageWrapper>
    )
  }

  // Check existing membership
  let membresia = null
  if (session?.user?.id) {
    membresia = await getMembresiaByUserAndComunidad(
      Number(session.user.id),
      comunidad.idcomunidad
    )
  }

  const isMaster = session?.user?.rolapp === "MASTER"

  return (
    <PageWrapper>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 border border-violet-100 mx-auto mb-4">
        <Building2 size={28} className="text-violet-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{comunidad.nombre}</h1>
      {comunidad.descripcion && (
        <p className="text-gray-500 text-sm mb-1">{comunidad.descripcion}</p>
      )}
      <div className="flex items-center justify-center gap-1.5 text-sm text-gray-400 mb-6">
        <Users size={14} />
        <span>{comunidad._count.miembros} miembro{comunidad._count.miembros !== 1 ? "s" : ""}</span>
      </div>

      {!session && (
        <a
          href="/login"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 px-6 py-3 text-sm font-semibold text-white transition-colors"
        >
          Iniciar sesión para unirte
        </a>
      )}

      {session && isMaster && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-5 py-3 text-sm text-amber-700">
          Los cuentas master no pueden unirse a comunidades.
        </div>
      )}

      {session && !isMaster && membresia?.estado === "APROBADA" && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={16} />
          Ya eres miembro de esta comunidad.
        </div>
      )}

      {session && !isMaster && membresia?.estado === "PENDIENTE" && (
        <div className="rounded-xl bg-blue-50 border border-blue-200 px-5 py-3 text-sm text-blue-700">
          Tu solicitud para unirte está pendiente de aprobación.
        </div>
      )}

      {session && !isMaster && membresia?.estado === "BLOQUEADA" && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-3 text-sm text-red-700">
          No puedes unirte a esta comunidad.
        </div>
      )}

      {session && !isMaster && (!membresia || membresia.estado === "RECHAZADA") && (
        <JoinButton codigoinvitacion={codigoinvitacion} />
      )}

      {comunidad.codigoexpiracion && (
        <p className="mt-4 text-xs text-gray-400">
          Invitación válida hasta{" "}
          {new Date(comunidad.codigoexpiracion).toLocaleDateString("es-ES", {
            day: "numeric", month: "long", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
        </p>
      )}
    </PageWrapper>
  )
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-sm p-8 text-center">
        {children}
      </div>
    </div>
  )
}
