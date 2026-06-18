import { auth } from "@/server/auth"
import { updateUserAction } from "@/features/auth/actions"
import { redirect } from "next/navigation"
import EditUserForm from "@/features/auth/components/EditUserForm"
import { getUserById } from "@/server/services/userService"

export default async function EditarPerfilPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()

  if (Number(id) !== Number(session?.user?.id)) redirect("/profile")

  const usuario = await getUserById(Number(session?.user?.id))

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Cuenta</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900">Editar perfil</h1>
        <p className="mt-1.5 text-sm text-gray-500 mb-6">Actualiza tu nombre, teléfono o contraseña.</p>
        <EditUserForm
          defaultNombre={usuario?.nombre || ""}
          defaultTelefono={usuario?.telefono || ""}
          updateUserAction={updateUserAction}
        />
      </div>
    </main>
  )
}
