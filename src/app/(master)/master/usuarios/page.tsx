import { getUsuariosAction } from "@/features/master/actions"
import Link from "next/link"
import { Users, Plus } from "lucide-react"

export default async function UsuariosPage() {
  const usuarios = await getUsuariosAction()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Usuarios</h1>
          <p className="text-sm text-gray-500">{usuarios.length} usuarios registrados</p>
        </div>
        <Link
          href="/master/usuarios/crear"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Nuevo usuario
        </Link>
      </div>

      {usuarios.length === 0 ? (
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-12 text-center">
          <Users size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No hay usuarios aún</p>
        </div>
      ) : (
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide bg-gray-50">
                <th className="text-left px-5 py-3 font-medium">Usuario</th>
                <th className="text-left px-5 py-3 font-medium">Teléfono</th>
                <th className="text-left px-5 py-3 font-medium">Rol app</th>
                <th className="text-left px-5 py-3 font-medium">Comunidades</th>
                <th className="text-left px-5 py-3 font-medium">Estado</th>
                <th className="text-left px-5 py-3 font-medium">Registro</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => {
                const esAdmin = u.membresias.some((m) => m.rol === "ADMIN")

                return (
                  <tr
                    key={u.idusuario}
                    className={`border-b border-gray-50 last:border-0 ${i % 2 !== 0 ? "bg-gray-50/50" : ""}`}
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">{u.nombre}</p>
                      <p className="text-xs text-gray-400">{u.correo}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{u.telefono}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        u.rolapp === "MASTER"
                          ? "bg-violet-100 text-violet-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {u.rolapp}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {u.rolapp === "MASTER" ? (
                        <span className="text-xs text-gray-300">—</span>
                      ) : u.membresias.length === 0 ? (
                        <span className="text-xs text-gray-400">Sin comunidad</span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {u.membresias.map((m, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                m.rol === "ADMIN"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-blue-50 text-blue-600"
                              }`}>
                                {m.rol === "ADMIN" ? "Admin" : "Miembro"}
                              </span>
                              <span className="text-xs text-gray-500 truncate max-w-32">
                                {m.comunidad.nombre}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        u.isactive === 1
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-600"
                      }`}>
                        {u.isactive === 1 ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {new Date(u.fecharegistro).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
