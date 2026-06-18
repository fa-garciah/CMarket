import { getComunidadesAction, getUsuariosAction } from "@/features/master/actions"
import { Building2, Users, CheckCircle, XCircle } from "lucide-react"

export default async function MasterDashboardPage() {
  const [comunidades, usuarios] = await Promise.all([
    getComunidadesAction(),
    getUsuariosAction(),
  ])

  const comunidadesActivas = comunidades.filter((c) => c.isactive === 1).length
  const usuariosActivos = usuarios.filter((u) => u.isactive === 1).length
  const masters = usuarios.filter((u) => u.rolapp === "MASTER").length

  const stats = [
    {
      label: "Comunidades",
      value: comunidades.length,
      sub: `${comunidadesActivas} activas`,
      icon: Building2,
      color: "text-violet-600",
      bg: "bg-violet-100",
    },
    {
      label: "Usuarios",
      value: usuarios.length,
      sub: `${usuariosActivos} activos`,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Masters",
      value: masters,
      sub: "con acceso total",
      icon: CheckCircle,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      label: "Inactivos",
      value: usuarios.length - usuariosActivos,
      sub: "sin verificar",
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-100",
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">Resumen general de la plataforma</p>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
            <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Últimas comunidades</h2>
          <div className="space-y-3">
            {comunidades.slice(0, 5).map((c) => (
              <div key={c.idcomunidad} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{c.nombre}</p>
                  <p className="text-xs text-gray-400">{c._count.miembros} miembros</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  c.isactive === 1 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                }`}>
                  {c.isactive === 1 ? "Activa" : "Inactiva"}
                </span>
              </div>
            ))}
            {comunidades.length === 0 && <p className="text-sm text-gray-400">No hay comunidades aún</p>}
          </div>
        </div>

        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Últimos usuarios</h2>
          <div className="space-y-3">
            {usuarios.slice(0, 5).map((u) => (
              <div key={u.idusuario} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{u.nombre}</p>
                  <p className="text-xs text-gray-400">{u.correo}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  u.rolapp === "MASTER" ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {u.rolapp}
                </span>
              </div>
            ))}
            {usuarios.length === 0 && <p className="text-sm text-gray-400">No hay usuarios aún</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
