"use client"

import { Fragment } from "react"
import Link from "next/link"
import ToggleComunidadButton from "@/features/master/components/ToggleComunidadButton"
import InviteCodeCell from "@/features/master/components/InviteCodeCell"

type ComunidadTableItem = {
  idcomunidad: number
  nombre: string
  descripcion?: string | null
  slug: string
  codigoinvitacion: string | null
  codigoexpiracion: string | null
  isactive: number
  _count: { miembros: number }
}

type ComunidadesTableProps = {
  comunidades: ComunidadTableItem[]
}

export default function ComunidadesTable({ comunidades }: ComunidadesTableProps) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      {/* Mobile cards */}
      <div className="space-y-4 p-4 md:hidden">
        {comunidades.map((comunidad) => (
          <div key={comunidad.idcomunidad} className="rounded-3xl border border-gray-100 bg-gray-50 p-4 shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{comunidad.nombre}</p>
                  {comunidad.descripcion ? (
                    <p className="text-sm text-gray-500">{comunidad.descripcion}</p>
                  ) : (
                    <p className="text-sm text-gray-400">Sin descripción</p>
                  )}
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  comunidad.isactive === 1 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                }`}>
                  {comunidad.isactive === 1 ? "Activa" : "Inactiva"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Slug</p>
                  <p className="font-medium text-gray-800 break-all">{comunidad.slug}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Miembros</p>
                  <p className="font-medium text-gray-800">{comunidad._count.miembros}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-gray-400 mb-1">Código invitación</p>
                  <InviteCodeCell
                    idcomunidad={comunidad.idcomunidad}
                    codigoinvitacion={comunidad.codigoinvitacion}
                    codigoexpiracion={comunidad.codigoexpiracion}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Link
                  href={`/master/comunidades/editar/${comunidad.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700 transition hover:bg-violet-100"
                >
                  Editar
                </Link>
                <ToggleComunidadButton idcomunidad={comunidad.idcomunidad} isactive={comunidad.isactive} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
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
            {comunidades.map((comunidad, index) => (
              <Fragment key={comunidad.idcomunidad}>
                <tr className={`border-b border-gray-50 last:border-0 ${index % 2 !== 0 ? "bg-gray-50/50" : ""}`}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">{comunidad.nombre}</p>
                    {comunidad.descripcion && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{comunidad.descripcion}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-400 font-mono text-xs">{comunidad.slug}</td>
                  <td className="px-5 py-4 text-gray-700">{comunidad._count.miembros}</td>
                  <td className="px-5 py-4">
                    <InviteCodeCell
                      idcomunidad={comunidad.idcomunidad}
                      codigoinvitacion={comunidad.codigoinvitacion}
                      codigoexpiracion={comunidad.codigoexpiracion}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      comunidad.isactive === 1 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                    }`}>
                      {comunidad.isactive === 1 ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-5 py-4 flex items-center gap-2 justify-end">
                    <Link
                      href={`/master/comunidades/editar/${comunidad.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700 transition hover:bg-violet-100"
                    >
                      Editar
                    </Link>
                    <ToggleComunidadButton idcomunidad={comunidad.idcomunidad} isactive={comunidad.isactive} />
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
