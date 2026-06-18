import { getMasterProfileAction } from "@/features/master/actions"
import MasterProfileForm from "@/features/master/components/MasterProfileForm"
import { auth } from "@/server/auth"

export default async function MasterPerfilPage() {
  const [session, perfil] = await Promise.all([auth(), getMasterProfileAction()])

  if (!perfil) return null

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Mi Perfil</h1>
      <p className="text-sm text-gray-500 mb-8">{session?.user.email}</p>

      <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
        <MasterProfileForm nombre={perfil.nombre} telefono={perfil.telefono} />
      </div>
    </div>
  )
}
