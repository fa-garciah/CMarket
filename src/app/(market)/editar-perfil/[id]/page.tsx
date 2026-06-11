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
    <main className="flex-grow max-w-2xl mx-auto w-full px-6 py-10">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-black text-gray-800 mb-8">EDITAR PERFIL</h1>
        <EditUserForm
          defaultNombre={usuario?.nombre || ""}
          defaultTelefono={usuario?.telefono || ""}
          updateUserAction={updateUserAction}
        />
      </div>
    </main>
  )
}