"use client"

import { useMemo, useState } from "react"
import { Building2, Users, CheckCircle, XCircle } from "lucide-react"

type ComunidadItem = {
  idcomunidad: number
  nombre: string
  descripcion?: string | null
  isactive: number
  _count: { miembros: number }
}

type UsuarioItem = {
  idusuario: number
  nombre: string
  correo: string
  rolapp: "MASTER" | "USER"
  isactive: number
}

const categories = [
  { id: "Comunidades", label: "Comunidades" },
  { id: "Usuarios", label: "Usuarios" },
  { id: "Masters", label: "Masters" },
  { id: "Inactivos", label: "Inactivos" },
] as const

type CategoryId = (typeof categories)[number]["id"]

export default function MasterDashboard({
  comunidades,
  usuarios,
}: {
  comunidades: ComunidadItem[]
  usuarios: UsuarioItem[]
}) {
  const [selected, setSelected] = useState<CategoryId>("Comunidades")

  const comunidadesActivas = useMemo(
    () => comunidades.filter((c) => c.isactive === 1).length,
    [comunidades]
  )

  const usuariosActivos = useMemo(
    () => usuarios.filter((u) => u.isactive === 1).length,
    [usuarios]
  )

  const masters = useMemo(
    () => usuarios.filter((u) => u.rolapp === "MASTER").length,
    [usuarios]
  )

  const stats = [
    {
      id: "Comunidades" as const,
      label: "Comunidades",
      value: comunidades.length,
      sub: `${comunidadesActivas} activas`,
      icon: Building2,
      color: "text-violet-600",
      bg: "bg-violet-100",
    },
    {
      id: "Usuarios" as const,
      label: "Usuarios",
      value: usuarios.length,
      sub: `${usuariosActivos} activos`,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      id: "Masters" as const,
      label: "Masters",
      value: masters,
      sub: "con acceso total",
      icon: CheckCircle,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      id: "Inactivos" as const,
      label: "Inactivos",
      value: usuarios.length - usuariosActivos,
      sub: "sin verificar",
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-100",
    },
  ]

  const listItems = useMemo(() => {
    switch (selected) {
      case "Comunidades":
        return comunidades.map((c) => ({
          key: c.idcomunidad,
          title: c.nombre,
          subtitle: `${c._count.miembros} miembros · ${c.isactive === 1 ? "Activa" : "Inactiva"}`,
          status: c.isactive === 1 ? "Activa" : "Inactiva",
          badgeColor: c.isactive === 1 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600",
        }))
      case "Usuarios":
        return usuarios
          .filter((u) => u.rolapp === "USER")
          .map((u) => ({
            key: u.idusuario,
            title: u.nombre,
            subtitle: u.correo,
            status: u.isactive === 1 ? "Activo" : "Inactivo",
            badgeColor: u.isactive === 1 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600",
          }))
      case "Masters":
        return usuarios
          .filter((u) => u.rolapp === "MASTER")
          .map((u) => ({
            key: u.idusuario,
            title: u.nombre,
            subtitle: u.correo,
            status: "Master",
            badgeColor: "bg-violet-100 text-violet-700",
          }))
      case "Inactivos":
        return usuarios
          .filter((u) => u.isactive === 0)
          .map((u) => ({
            key: u.idusuario,
            title: u.nombre,
            subtitle: u.correo,
            status: u.rolapp === "MASTER" ? "Master inactivo" : "Usuario inactivo",
            badgeColor: "bg-red-100 text-red-600",
          }))
      default:
        return []
    }
  }, [selected, comunidades, usuarios])

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Resumen general de la plataforma</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelected(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  selected === category.id
                    ? "bg-violet-700 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-violet-50"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ id, label, value, sub, icon: Icon, color, bg }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSelected(id)}
            className={`group rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              selected === id ? "ring-2 ring-violet-500" : ""
            }`}
          >
            <div className={`inline-flex items-center justify-center rounded-lg p-2 ${bg} mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-sm font-medium text-gray-700 mt-1">{label}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{selected}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {selected === "Comunidades"
                  ? "Lista de comunidades y su estado"
                  : selected === "Usuarios"
                  ? "Usuarios registrados activos"
                  : selected === "Masters"
                  ? "Masters con acceso total"
                  : "Usuarios que aún no han verificado su cuenta"}
              </p>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {listItems.length} resultados
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {listItems.length === 0 ? (
              <p className="text-sm text-gray-500">No hay datos para mostrar.</p>
            ) : (
              listItems.map((item) => (
                <div
                  key={item.key}
                  className="flex flex-col rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
                  </div>
                  <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.badgeColor} sm:mt-0`}>
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-900">Insights</h2>
          <p className="text-sm text-gray-500 mt-1">
            Indicadores clave para entender la activación y el uso de la plataforma.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
              <p className="text-sm text-violet-700">Comunidades activas</p>
              <p className="text-3xl font-bold text-gray-900">{comunidadesActivas}</p>
              <p className="text-xs text-gray-500 mt-1">
                {comunidades.length > 0
                  ? `${Math.round((comunidadesActivas / comunidades.length) * 100)}% de todas las comunidades`
                  : "Sin comunidades aún"}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700">Usuarios activos</p>
              <p className="text-3xl font-bold text-gray-900">{usuariosActivos}</p>
              <p className="text-xs text-gray-500 mt-1">
                {usuarios.length > 0
                  ? `${Math.round((usuariosActivos / usuarios.length) * 100)}% del total de usuarios`
                  : "Sin usuarios aún"}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-sm text-amber-700">Masters totales</p>
              <p className="text-3xl font-bold text-gray-900">{masters}</p>
              <p className="text-xs text-gray-500 mt-1">
                {usuarios.length > 0
                  ? `${Math.round((masters / usuarios.length) * 100)}% del total de usuarios`
                  : "Sin usuarios aún"}
              </p>
            </div>
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm text-red-700">Usuarios inactivos</p>
              <p className="text-3xl font-bold text-gray-900">{usuarios.length - usuariosActivos}</p>
              <p className="text-xs text-gray-500 mt-1">
                {usuarios.length > 0
                  ? `${Math.round(((usuarios.length - usuariosActivos) / usuarios.length) * 100)}% sin verificar`
                  : "Sin usuarios aún"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
