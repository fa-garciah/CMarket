import EditComunidadPageWrapper from "@/features/master/components/EditComunidadPageWrapper"
import MiembrosAdminPanel from "@/features/master/components/MiembrosAdminPanel"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getComunidadBySlug } from "@/server/services/comunidadService"
import { getMiembrosComunidadAction, getUsuariosListAction } from "@/features/master/actions"
import { notFound } from "next/navigation"

export default async function EditarComunidadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!slug) notFound()

  const comunidad = await getComunidadBySlug(slug)
  if (!comunidad) notFound()

  const [miembros, usuarios] = await Promise.all([
    getMiembrosComunidadAction(comunidad.idcomunidad),
    getUsuariosListAction(),
  ])

  return (
    <div className="max-w-3xl">
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

      <EditComunidadPageWrapper
        idcomunidad={comunidad.idcomunidad}
        nombre={comunidad.nombre}
        descripcion={comunidad.descripcion}
      />

      <MiembrosAdminPanel
        idcomunidad={comunidad.idcomunidad}
        miembros={miembros}
        usuarios={usuarios}
      />
    </div>
  )
}
