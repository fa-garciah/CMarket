"use client"

import { useMemo } from "react"

type UserFiltersProps = {
  roles: string[]
  comunidades: string[]
  selectedRole: string
  selectedComunidad: string
  selectedEstado: string
  onChangeRole: (value: string) => void
  onChangeComunidad: (value: string) => void
  onChangeEstado: (value: string) => void
}

export default function UserFilters({
  roles,
  comunidades,
  selectedRole,
  selectedComunidad,
  selectedEstado,
  onChangeRole,
  onChangeComunidad,
  onChangeEstado,
}: UserFiltersProps) {
  const opcionesComunidades = useMemo(
    () => ["Todos", ...comunidades.filter(Boolean)],
    [comunidades]
  )

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm mb-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Rol app</span>
          <select
            value={selectedRole}
            onChange={(event) => onChangeRole(event.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          >
            <option value="Todos">Todos</option>
            {roles.map((rol) => (
              <option key={rol} value={rol}>
                {rol}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Comunidad</span>
          <select
            value={selectedComunidad}
            onChange={(event) => onChangeComunidad(event.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          >
            {opcionesComunidades.map((comunidad) => (
              <option key={comunidad} value={comunidad}>
                {comunidad}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Estado</span>
          <select
            value={selectedEstado}
            onChange={(event) => onChangeEstado(event.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          >
            <option value="Todos">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </label>
      </div>
    </div>
  )
}
