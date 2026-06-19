import { auth } from "@/server/auth"
import { getComunidadBySlug } from "@/server/services/comunidadService"
import { getMembresiaByUserAndComunidad, getMiembrosByComunidad } from "@/server/services/membresiaService"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, Clock, CheckCircle2, XCircle, ShieldX } from "lucide-react"
import Link from "next/link"
import MemberActions from "./MemberActions"
import ComunidadInviteCodePanel from "@/features/comunidad/components/ComunidadInviteCodePanel"

type Props = { params: Promise<{ slug: string }> }

const ESTADO_BADGE: Record<string, { label: string; classes: string }> = {
  APROBADA:  { label: "Miembro",   classes: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  PENDIENTE: { label: "Pendiente", classes: "bg-amber-50 text-amber-700 border-amber-100" },
  RECHAZADA: { label: "Rechazada", classes: "bg-red-50 text-red-600 border-red-100" },
  BLOQUEADA: { label: "Bloqueada", classes: "bg-gray-100 text-gray-500 border-gray-200" },
}

export default async function AdminComunidadPage({ params }: Props) {
  const { slug } = await params
  const [session, comunidad] = await Promise.all([auth(), getComunidadBySlug(slug)])

  if (!comunidad) notFound()

  if (!session) redirect("/login")

  const miMembresia = await getMembresiaByUserAndComunidad(
    Number(session.user.id),
    comunidad.idcomunidad,
  )

  if (!miMembresia || miMembresia.rol !== "ADMIN" || miMembresia.estado !== "APROBADA") {
    redirect(`/comunidad/${slug}`)
  }

  const miembros = await getMiembrosByComunidad(comunidad.idcomunidad)

  const pendientes = miembros.filter((m) => m.estado === "PENDIENTE")
  const aprobados  = miembros.filter((m) => m.estado === "APROBADA")
  const bloqueados = miembros.filter((m) => m.estado === "BLOQUEADA")
  const rechazados = miembros.filter((m) => m.estado === "RECHAZADA")

  const com = comunidad as typeof comunidad & {
    codigoinvitacion: string | null
    codigoexpiracion: Date | null
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-10">

      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/comunidad/${slug}`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={14} />
          Volver a {comunidad.nombre}
        </Link>
        <h1 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">Panel de administración</h1>
        <p className="mt-1 text-sm text-gray-500">{comunidad.nombre}</p>
      </div>

      {/* Invite code */}
      <ComunidadInviteCodePanel
        idcomunidad={comunidad.idcomunidad}
        codigoinvitacion={com.codigoinvitacion}
        codigoexpiracion={com.codigoexpiracion?.toISOString() ?? null}
      />

      {/* Pending */}
      <Section
        title="Solicitudes pendientes"
        count={pendientes.length}
        icon={<Clock size={15} className="text-amber-500" />}
        empty="No hay solicitudes pendientes"
      >
        {pendientes.map((m) => (
          <MemberRow key={m.idmembresia} m={m} />
        ))}
      </Section>

      {/* Approved */}
      <Section
        title="Miembros activos"
        count={aprobados.length}
        icon={<CheckCircle2 size={15} className="text-emerald-500" />}
        empty="No hay miembros activos aún"
      >
        {aprobados.map((m) => (
          <MemberRow key={m.idmembresia} m={m} />
        ))}
      </Section>

      {/* Blocked */}
      {bloqueados.length > 0 && (
        <Section
          title="Bloqueados"
          count={bloqueados.length}
          icon={<ShieldX size={15} className="text-gray-400" />}
          empty=""
        >
          {bloqueados.map((m) => (
            <MemberRow key={m.idmembresia} m={m} />
          ))}
        </Section>
      )}

      {/* Rejected */}
      {rechazados.length > 0 && (
        <Section
          title="Rechazados"
          count={rechazados.length}
          icon={<XCircle size={15} className="text-red-400" />}
          empty=""
        >
          {rechazados.map((m) => (
            <MemberRow key={m.idmembresia} m={m} />
          ))}
        </Section>
      )}
    </div>
  )
}

// --- Sub-components ---

type Miembro = {
  idmembresia: number
  estado: string
  rol: string
  usuario: { idusuario: number; nombre: string; correo: string }
}

function MemberRow({ m }: { m: Miembro }) {
  const badge = ESTADO_BADGE[m.estado]
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 border border-violet-100 text-sm font-bold text-violet-700">
          {m.usuario.nombre.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-800 truncate">{m.usuario.nombre}</p>
            {m.rol === "ADMIN" && (
              <span className="shrink-0 rounded-full bg-violet-50 border border-violet-200 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                Admin
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 truncate">{m.usuario.correo}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {badge && (
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badge.classes}`}>
            {badge.label}
          </span>
        )}
        {m.rol !== "ADMIN" && (
          <MemberActions idmembresia={m.idmembresia} estadoActual={m.estado} />
        )}
      </div>
    </div>
  )
}

function Section({
  title, count, icon, empty, children,
}: {
  title: string
  count: number
  icon: React.ReactNode
  empty: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-6 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
        {icon}
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
        <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
          {count}
        </span>
      </div>
      <div className="px-5">
        {count === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">{empty}</p>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
