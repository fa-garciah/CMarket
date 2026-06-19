import { getComunidadesAction } from "@/features/master/actions"
import Link from "next/link"
import { Building2, Plus } from "lucide-react"
import ComunidadesTable from "@/features/master/components/ComunidadesTable"

export default async function ComunidadesPage() {
  const raw = await getComunidadesAction()

  // Serialize Date fields so they can be passed to the client component ComunidadesTable
  const comunidades = raw.map((c) => {
    const anyC = c as Record<string, unknown>
    return {
      idcomunidad:      c.idcomunidad,
      nombre:           c.nombre,
      descripcion:      c.descripcion ?? null,
      slug:             c.slug,
      isactive:         c.isactive,
      _count:           c._count,
      codigoinvitacion: (anyC.codigoinvitacion as string | null | undefined) ?? null,
      codigoexpiracion: anyC.codigoexpiracion instanceof Date
        ? (anyC.codigoexpiracion as Date).toISOString()
        : (anyC.codigoexpiracion as string | null | undefined) ?? null,
    }
  })

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Comunidades</h1>
          <p className="text-sm text-gray-500">{comunidades.length} comunidades registradas</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/master/comunidades/crear"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Nueva comunidad
          </Link>
        </div>
      </div>

      {comunidades.length === 0 ? (
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-12 text-center">
          <Building2 size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No hay comunidades aún</p>
          <p className="text-gray-400 text-sm mt-1">Crea la primera comunidad para comenzar</p>
        </div>
      ) : (
        <ComunidadesTable comunidades={comunidades} />
      )}
    </div>
  )
}
