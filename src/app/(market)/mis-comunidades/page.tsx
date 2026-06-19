import { auth } from "@/server/auth"
import { getMembresiasByUser } from "@/server/services/membresiaService"
import { Building2, Clock, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import CodigoInput from "./CodigoInput"

const ESTADO_CONFIG = {
  APROBADA:  { label: "Miembro", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  PENDIENTE: { label: "Pendiente", icon: Clock,       color: "text-amber-600",  bg: "bg-amber-50 border-amber-100"   },
  RECHAZADA: { label: "Rechazada", icon: XCircle,     color: "text-red-500",    bg: "bg-red-50 border-red-100"       },
  BLOQUEADA: { label: "Bloqueada", icon: XCircle,     color: "text-gray-400",   bg: "bg-gray-50 border-gray-100"     },
} as const

export default async function MisComunidadesPage() {
  const session = await auth()
  const membresias = await getMembresiasByUser(Number(session?.user?.id))

  const aprobadas  = membresias.filter((m) => m.estado === "APROBADA")
  const pendientes = membresias.filter((m) => m.estado === "PENDIENTE")
  const otras      = membresias.filter((m) => m.estado === "RECHAZADA" || m.estado === "BLOQUEADA")

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col p-4 sm:p-6 lg:p-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">Mis Comunidades</h1>
          <p className="mt-1 text-sm text-gray-500">
            {aprobadas.length} comunidad{aprobadas.length !== 1 ? "es" : ""} activa{aprobadas.length !== 1 ? "s" : ""}
            {pendientes.length > 0 && ` · ${pendientes.length} pendiente${pendientes.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="w-full sm:max-w-sm">
          <CodigoInput />
        </div>
      </div>

      {membresias.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 border border-violet-100">
            <Building2 size={28} className="text-violet-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Aún no eres parte de ninguna comunidad</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Pide a un administrador que te comparta un enlace de invitación para unirte.
          </p>
        </div>
      )}

      {aprobadas.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Comunidades</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {aprobadas.map(({ comunidad, rol }) => (
              <div
                key={comunidad.idcomunidad}
                className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{comunidad.nombre}</p>
                    {comunidad.descripcion && (
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{comunidad.descripcion}</p>
                    )}
                  </div>
                  {rol === "ADMIN" && (
                    <span className="shrink-0 rounded-full bg-violet-50 border border-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700">
                      Admin
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{comunidad._count.miembros} miembro{comunidad._count.miembros !== 1 ? "s" : ""}</span>
                  <Link
                    href={`/comunidad/${comunidad.slug}`}
                    className="text-violet-600 hover:text-violet-800 font-medium transition-colors"
                  >
                    Ver comunidad →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {pendientes.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Solicitudes pendientes</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {pendientes.map(({ comunidad }) => (
              <div
                key={comunidad.idcomunidad}
                className="rounded-2xl bg-amber-50 border border-amber-100 p-5 flex items-center gap-4"
              >
                <Clock size={20} className="text-amber-500 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">{comunidad.nombre}</p>
                  <p className="text-xs text-amber-600 mt-0.5">Esperando aprobación del administrador</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {otras.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Otras solicitudes</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {otras.map(({ comunidad, estado }) => {
              const cfg = ESTADO_CONFIG[estado as keyof typeof ESTADO_CONFIG]
              const Icon = cfg.icon
              return (
                <div
                  key={comunidad.idcomunidad}
                  className={`rounded-2xl border p-5 flex items-center gap-4 ${cfg.bg}`}
                >
                  <Icon size={20} className={`${cfg.color} shrink-0`} />
                  <div>
                    <p className="font-semibold text-gray-900">{comunidad.nombre}</p>
                    <p className={`text-xs mt-0.5 ${cfg.color}`}>{cfg.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
