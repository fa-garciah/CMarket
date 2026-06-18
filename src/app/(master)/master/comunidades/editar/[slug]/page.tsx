import EditComunidadForm from "@/features/master/components/EditComunidadForm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getComunidadBySlug } from "@/server/services/comunidadService"
import { notFound } from "next/navigation"

export default async function EditarComunidadPage({ params }: { params: { slug?: string | string[] } }) {
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  if (!slug) notFound()

  const comunidad = await getComunidadBySlug(slug)

  if (!comunidad) {
    notFound()
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/master/comunidades"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a comunidades
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Editar comunidad</h1>
      <p className="text-sm text-gray-500 mb-8">
        Ajusta el nombre o la descripción de esta comunidad.
      </p>

      <EditComunidadForm
        idcomunidad={comunidad.idcomunidad}
        nombre={comunidad.nombre}
        descripcion={comunidad.descripcion}
        onCancel={() => undefined}
        onSaved={() => {
          window.location.href = "/master/comunidades"
        }}
      />
    </div>
  )
}
