import { Building2, Lock } from "lucide-react"

export default function MisComunidadesPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Mis Comunidades</h1>
        <p className="mt-1 text-sm text-gray-500">Las comunidades a las que perteneces</p>
      </div>

      <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 border border-violet-100">
          <Building2 size={28} className="text-violet-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Aún no eres parte de ninguna comunidad</h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
          Únete a una comunidad con un enlace de invitación para comprar y vender con personas de tu universidad, empresa o conjunto.
        </p>
        <div className="inline-flex items-center gap-2 rounded-xl bg-gray-100 border border-gray-200 px-5 py-3 text-sm text-gray-500">
          <Lock size={14} />
          Próximamente: unirse con código de invitación
        </div>
      </div>
    </div>
  )
}
