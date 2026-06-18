"use client"

import { useMemo, useState } from "react"
import UserFilters from "@/features/master/components/UserFilters"

type UsuarioTableItem = {
  idusuario: number
  nombre: string
  correo: string
  telefono: string
  rolapp: "MASTER" | "USER"
  isactive: number
  fecharegistro: Date
  membresias: Array<{ rol: "ADMIN" | "USER"; estado: string; comunidad: { nombre: string } }>
}

type UsersTableProps = {
  usuarios: UsuarioTableItem[]
}

const TODOS = "Todos"

export default function UsersTable({ usuarios }: UsersTableProps) {
  const [selectedRole, setSelectedRole] = useState<string>(TODOS)
  const [selectedComunidad, setSelectedComunidad] = useState<string>(TODOS)
  const [selectedEstado, setSelectedEstado] = useState<string>(TODOS)

  const roles = useMemo(() => Array.from(new Set(usuarios.map((u) => u.rolapp))), [usuarios])
  const comunidades = useMemo(
    () => Array.from(new Set(usuarios.flatMap((u) => u.membresias.map((m) => m.comunidad.nombre)))),
    [usuarios]
  )

  const filteredUsuarios = useMemo(() => {
    return usuarios.filter((u) => {
      const matchesRole = selectedRole === TODOS || u.rolapp === selectedRole
      const matchesEstado = selectedEstado === TODOS || (selectedEstado === "Activo" ? u.isactive === 1 : u.isactive === 0)
      const matchesComunidad =
        selectedComunidad === TODOS ||
        u.membresias.some((m) => m.comunidad.nombre === selectedComunidad)

      return matchesRole && matchesEstado && matchesComunidad
    })
  }, [usuarios, selectedRole, selectedComunidad, selectedEstado])

  return (
    <div>
      <UserFilters
        roles={roles}
        comunidades={comunidades}
        selectedRole={selectedRole}
        selectedComunidad={selectedComunidad}
        selectedEstado={selectedEstado}
        onChangeRole={setSelectedRole}
        onChangeComunidad={setSelectedComunidad}
        onChangeEstado={setSelectedEstado}
      />

      <div className="space-y-4 md:hidden">
        {filteredUsuarios.map((u) => (
          <div key={u.idusuario} className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900">{u.nombre}</p>
                <p className="text-sm text-gray-500 truncate">{u.correo}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                u.isactive === 1 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
              }`}>
                {u.isactive === 1 ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Teléfono</p>
                <p className="font-medium text-gray-900">{u.telefono}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Rol</p>
                <p className="font-medium text-gray-900">{u.rolapp}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Comunidades</p>
                <div className="mt-2 space-y-1">
                  {u.rolapp === "MASTER" ? (
                    <p className="text-sm text-gray-500">—</p>
                  ) : u.membresias.length === 0 ? (
                    <p className="text-sm text-gray-500">Sin comunidad</p>
                  ) : (
                    <div className="space-y-1">
                      {u.membresias.map((m, idx) => (
                        <div key={idx} className="flex flex-wrap items-center gap-2">
                          <span className={`text-[11px] px-2 py-1 rounded-full ${
                            m.rol === "ADMIN" ? "bg-amber-100 text-amber-700" : "bg-blue-50 text-blue-600"
                          }`}>
                            {m.rol === "ADMIN" ? "Admin" : "Miembro"}
                          </span>
                          <span className="text-sm text-gray-700">{m.comunidad.nombre}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Registro</p>
                <p className="font-medium text-gray-900">{new Date(u.fecharegistro).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-x-auto hidden md:block">
        <table className="w-full min-w-[720px] text-sm">
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
            {filteredUsuarios.map((u, i) => (
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
                    u.rolapp === "MASTER" ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-600"
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
                        <div key={idx} className="flex flex-wrap items-center gap-1.5">
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                            m.rol === "ADMIN" ? "bg-amber-100 text-amber-700" : "bg-blue-50 text-blue-600"
                          }`}>
                            {m.rol === "ADMIN" ? "Admin" : "Miembro"}
                          </span>
                          <span className="text-xs text-gray-500 truncate max-w-32">{m.comunidad.nombre}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    u.isactive === 1 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
