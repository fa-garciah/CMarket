"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  setRolComunidadAction,
  addMiembroDirectoAction,
  removeMiembroAction,
} from "@/features/master/actions"
import { Crown, User, Trash2, UserPlus } from "lucide-react"

type Miembro = {
  idmembresia: number
  rol: string
  estado: string
  usuario: { idusuario: number; nombre: string; correo: string }
}

type Usuario = { idusuario: number; nombre: string; correo: string }

type Props = {
  idcomunidad: number
  miembros: Miembro[]
  usuarios: Usuario[]
}

export default function MiembrosAdminPanel({ idcomunidad, miembros, usuarios }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<number | string | null>(null)
  const [selectedUser, setSelectedUser] = useState<number>(0)
  const [selectedRol, setSelectedRol] = useState<"ADMIN" | "USER">("USER")
  const [addError, setAddError] = useState<string | null>(null)

  const aprobados = miembros.filter((m) => m.estado === "APROBADA")
  const pendientes = miembros.filter((m) => m.estado !== "APROBADA")

  // Users not yet approved members
  const approvedIds = new Set(aprobados.map((m) => m.usuario.idusuario))
  const disponibles = usuarios.filter((u) => !approvedIds.has(u.idusuario))

  async function handleRol(idmembresia: number, rol: "ADMIN" | "USER") {
    setLoading(idmembresia)
    await setRolComunidadAction(idmembresia, rol)
    setLoading(null)
    router.refresh()
  }

  async function handleRemove(idmembresia: number) {
    setLoading(`remove-${idmembresia}`)
    await removeMiembroAction(idmembresia)
    setLoading(null)
    router.refresh()
  }

  async function handleAdd() {
    if (!selectedUser) { setAddError("Selecciona un usuario"); return }
    setAddError(null)
    setLoading("add")
    await addMiembroDirectoAction(selectedUser, idcomunidad, selectedRol)
    setLoading(null)
    setSelectedUser(0)
    router.refresh()
  }

  return (
    <div className="mt-10 space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Miembros</h2>

      {/* Add member form */}
      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <UserPlus size={15} className="text-violet-500" />
          Agregar miembro directamente
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(Number(e.target.value))}
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 focus:border-violet-400 focus:bg-white focus:outline-none"
          >
            <option value={0}>Selecciona un usuario</option>
            {disponibles.map((u) => (
              <option key={u.idusuario} value={u.idusuario}>
                {u.nombre} — {u.correo}
              </option>
            ))}
          </select>
          <select
            value={selectedRol}
            onChange={(e) => setSelectedRol(e.target.value as "ADMIN" | "USER")}
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 focus:border-violet-400 focus:bg-white focus:outline-none"
          >
            <option value="USER">Usuario</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button
            onClick={handleAdd}
            disabled={loading === "add" || !selectedUser}
            className="rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            {loading === "add" ? "Agregando..." : "Agregar"}
          </button>
        </div>
        {addError && <p className="mt-2 text-xs text-red-500">{addError}</p>}
        {disponibles.length === 0 && (
          <p className="mt-2 text-xs text-gray-400">Todos los usuarios del sistema ya son miembros aprobados.</p>
        )}
      </div>

      {/* Approved members */}
      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-3.5 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Miembros aprobados</p>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">{aprobados.length}</span>
        </div>
        {aprobados.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">Ningún miembro aprobado aún.</p>
        ) : (
          <ul className="divide-y divide-gray-50 px-5">
            {aprobados.map((m) => (
              <li key={m.idmembresia} className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 border border-violet-100 text-sm font-bold text-violet-700">
                    {m.usuario.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{m.usuario.nombre}</p>
                    <p className="text-xs text-gray-400 truncate">{m.usuario.correo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Role badge */}
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                    m.rol === "ADMIN"
                      ? "bg-violet-50 border-violet-200 text-violet-700"
                      : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}>
                    {m.rol === "ADMIN" ? <Crown size={9} /> : <User size={9} />}
                    {m.rol === "ADMIN" ? "Admin" : "Usuario"}
                  </span>
                  {/* Toggle role */}
                  <button
                    onClick={() => handleRol(m.idmembresia, m.rol === "ADMIN" ? "USER" : "ADMIN")}
                    disabled={loading === m.idmembresia}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                  >
                    {loading === m.idmembresia ? "..." : m.rol === "ADMIN" ? "Degradar" : "Promover"}
                  </button>
                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(m.idmembresia)}
                    disabled={loading === `remove-${m.idmembresia}`}
                    className="rounded-lg border border-red-100 bg-red-50 p-1.5 text-red-400 hover:bg-red-100 disabled:opacity-40 transition-colors"
                    title="Eliminar miembro"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pending / blocked */}
      {pendientes.length > 0 && (
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-3.5 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Otras solicitudes</p>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">{pendientes.length}</span>
          </div>
          <ul className="divide-y divide-gray-50 px-5">
            {pendientes.map((m) => (
              <li key={m.idmembresia} className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
                    {m.usuario.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{m.usuario.nombre}</p>
                    <p className="text-xs text-gray-400 truncate">{m.usuario.correo}</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{m.estado}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
