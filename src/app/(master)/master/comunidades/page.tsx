import { getComunidadesAction } from "@/features/master/actions"
import Link from "next/link"
import { Building2, Plus } from "lucide-react"
import ToggleComunidadButton from "@/features/master/components/ToggleComunidadButton"
import CopyButton from "@/features/master/components/CopyButton"

export default async function ComunidadesPage() {
  const comunidades = await getComunidadesAction()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Comunidades</h1>
          <p className="text-sm text-gray-500">{comunidades.length} comunidades registradas</p>
        </div>
        <Link
          href="/master/comunidades/crear"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Nueva comunidad
        </Link>
      </div>

      {comunidades.length === 0 ? (
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-12 text-center">
          <Building2 size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No hay comunidades aún</p>
          <p className="text-gray-400 text-sm mt-1">Crea la primera comunidad para comenzar</p>
        </div>
      ) : (
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide bg-gray-50">
                <th className="text-left px-5 py-3 font-medium">Nombre</th>
                <th className="text-left px-5 py-3 font-medium">Slug</th>
                <th className="text-left px-5 py-3 font-medium">Miembros</th>
                <th className="text-left px-5 py-3 font-medium">Código invitación</th>
                <th className="text-left px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {comunidades.map((c, i) => (
                <tr key={c.idcomunidad} className={`border-b border-gray-50 last:border-0 ${i % 2 !== 0 ? "bg-gray-50/50" : ""}`}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">{c.nombre}</p>
                    {c.descripcion && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{c.descripcion}</p>}
                  </td>
                  <td className="px-5 py-4 text-gray-400 font-mono text-xs">{c.slug}</td>
                  <td className="px-5 py-4 text-gray-700">{c._count.miembros}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gray-400 truncate max-w-35">{c.codigoinvitacion}</span>
                      <CopyButton value={c.codigoinvitacion} />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      c.isactive === 1 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                    }`}>
                      {c.isactive === 1 ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <ToggleComunidadButton idcomunidad={c.idcomunidad} isactive={c.isactive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
