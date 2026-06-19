import { getUsuariosAction } from "@/features/master/actions"
import Link from "next/link"
import { Users, Plus } from "lucide-react"
import UsersTable from "@/features/master/components/UsersTable"

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
        <UsersTable usuarios={usuarios} />
      )}
    </div>
  )
}
