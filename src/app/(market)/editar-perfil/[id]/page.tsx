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
    <main className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-grow px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full rounded-[28px] border border-white/10 bg-[#231f39]/90 p-8 shadow-[0_30px_90px_rgba(10,10,30,0.35)] backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-indigo-100/80">Perfil</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Editar perfil</h1>
        <p className="mt-3 text-sm text-slate-200/95">Actualiza tus datos con el mismo estilo visual que el resto de la plataforma.</p>
        <EditUserForm
          defaultNombre={usuario?.nombre || ""}
          defaultTelefono={usuario?.telefono || ""}
          updateUserAction={updateUserAction}
        />
      </div>
    </main>
  )
}