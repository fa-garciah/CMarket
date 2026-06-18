import CreateUserForm from "@/features/master/components/CreateUserForm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CrearUsuarioPage() {
  return (
    <div className="max-w-lg">
      <Link
        href="/master/usuarios"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a usuarios
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Nuevo usuario</h1>
      <p className="text-sm text-gray-500 mb-8">
        El usuario creado desde aquí queda activo directamente, sin verificación de correo.
      </p>

      <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
        <CreateUserForm />
      </div>
    </div>
  )
}
