import CreateComunidadForm from "@/features/master/components/CreateComunidadForm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CrearComunidadPage() {
  return (
    <div className="max-w-lg">
      <Link
        href="/master/comunidades"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a comunidades
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Nueva comunidad</h1>
      <p className="text-sm text-gray-500 mb-8">
        El slug y el código de invitación se generan automáticamente.
      </p>

      <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
        <CreateComunidadForm />
      </div>
    </div>
  )
}
