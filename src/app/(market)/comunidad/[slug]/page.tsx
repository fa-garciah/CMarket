import { auth } from "@/server/auth"
import { getComunidadBySlug, getProductosByComunidad } from "@/server/services/comunidadService"
import { getMembresiaByUserAndComunidad } from "@/server/services/membresiaService"
import { notFound } from "next/navigation"
import { Building2, Clock, ShieldX, Package, Users, Crown } from "lucide-react"
import ProductCard from "@/features/products/components/ProductCard"
import SearchFilter from "@/features/products/components/SearchFilter"

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ search?: string; category?: string }>
}

export default async function ComunidadPage({ params, searchParams }: Props) {
  const [{ slug }, { search, category }] = await Promise.all([params, searchParams])
  const [session, comunidad] = await Promise.all([auth(), getComunidadBySlug(slug)])

  if (!comunidad || !comunidad.isactive) notFound()

  // Check membership
  const membresia = session?.user?.id
    ? await getMembresiaByUserAndComunidad(Number(session.user.id), comunidad.idcomunidad)
    : null

  const isApproved = membresia?.estado === "APROBADA"

  // Not a member or not logged in
  if (!isApproved) {
    return (
      <PageWrapper comunidad={comunidad}>
        <div className="flex flex-col items-center py-20 text-center">
          {!session && (
            <>
              <IconBox><ShieldX size={26} className="text-gray-400" /></IconBox>
              <h2 className="mt-4 text-lg font-bold text-gray-900">Inicia sesión para acceder</h2>
              <p className="mt-1 text-sm text-gray-500 max-w-sm">Necesitas una cuenta para ver el contenido de esta comunidad.</p>
              <a href="/login" className="mt-6 inline-flex rounded-xl bg-violet-600 hover:bg-violet-700 px-6 py-3 text-sm font-semibold text-white transition-colors">
                Iniciar sesión
              </a>
            </>
          )}

          {session && !membresia && (
            <>
              <IconBox><ShieldX size={26} className="text-gray-400" /></IconBox>
              <h2 className="mt-4 text-lg font-bold text-gray-900">Acceso restringido</h2>
              <p className="mt-1 text-sm text-gray-500 max-w-sm">Necesitas ser miembro aprobado para ver los productos de esta comunidad.</p>
            </>
          )}

          {session && membresia?.estado === "PENDIENTE" && (
            <>
              <IconBox><Clock size={26} className="text-amber-500" /></IconBox>
              <h2 className="mt-4 text-lg font-bold text-gray-900">Solicitud pendiente</h2>
              <p className="mt-1 text-sm text-gray-500 max-w-sm">Tu solicitud para unirte a esta comunidad está siendo revisada por el administrador.</p>
            </>
          )}

          {session && (membresia?.estado === "RECHAZADA" || membresia?.estado === "BLOQUEADA") && (
            <>
              <IconBox><ShieldX size={26} className="text-red-400" /></IconBox>
              <h2 className="mt-4 text-lg font-bold text-gray-900">Sin acceso</h2>
              <p className="mt-1 text-sm text-gray-500 max-w-sm">No tienes acceso a esta comunidad.</p>
            </>
          )}
        </div>
      </PageWrapper>
    )
  }

  // Approved member — load products
  const todosLosProductos = await getProductosByComunidad(comunidad.idcomunidad)
  const isAdmin = membresia.rol === "ADMIN"

  const categorias = [...new Set(todosLosProductos.map((p) => p.categoria.nombrecategoria))].sort()

  const productos = todosLosProductos.filter((p) => {
    const matchSearch = search
      ? p.nombreproducto.toLowerCase().includes(search.toLowerCase()) ||
        p.vendedor.nombre.toLowerCase().includes(search.toLowerCase())
      : true
    const matchCategory = category
      ? p.categoria.nombrecategoria.toLowerCase() === category.toLowerCase()
      : true
    return matchSearch && matchCategory
  })

  return (
    <PageWrapper comunidad={comunidad} memberCount={comunidad._count.miembros} isAdmin={isAdmin}>
      <SearchFilter
        categorias={categorias}
        currentSearch={search}
        currentCategory={category}
        placeholder="Buscar por producto o vendedor..."
      />
      {productos.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <IconBox><Package size={26} className="text-gray-400" /></IconBox>
          <h2 className="mt-4 text-lg font-bold text-gray-900">
            {search || category ? "Sin resultados" : "Sin productos aún"}
          </h2>
          <p className="mt-1 text-sm text-gray-500 max-w-sm">
            {search || category
              ? "Prueba con otra búsqueda o categoría."
              : "Ningún miembro ha publicado productos en esta comunidad todavía."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {productos.map((p) => (
            <ProductCard key={p.idproducto} {...p} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}

// --- Sub-components ---

type ComunidadInfo = {
  idcomunidad: number
  nombre: string
  slug: string
  descripcion: string | null
  _count: { miembros: number }
}

function PageWrapper({
  comunidad,
  memberCount,
  isAdmin,
  children,
}: {
  comunidad: ComunidadInfo
  memberCount?: number
  isAdmin?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-6xl p-6 sm:p-8 lg:p-10">
      {/* Header */}
      <div className="mb-8 rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 border border-violet-100">
              <Building2 size={24} className="text-violet-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-gray-900">{comunidad.nombre}</h1>
                {isAdmin && (
                  <a
                    href={`/comunidad/${comunidad.slug ?? ""}/admin`}
                    className="inline-flex items-center gap-1 rounded-full bg-violet-50 border border-violet-200 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700 hover:bg-violet-100 transition-colors"
                  >
                    <Crown size={10} />
                    Admin
                  </a>
                )}
              </div>
              {comunidad.descripcion && (
                <p className="mt-0.5 text-sm text-gray-500">{comunidad.descripcion}</p>
              )}
            </div>
          </div>
          {memberCount !== undefined && (
            <div className="flex items-center gap-1.5 text-sm text-gray-400 shrink-0">
              <Users size={14} />
              <span>{memberCount} miembro{memberCount !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
      </div>

      {children}
    </div>
  )
}

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 border border-gray-200">
      {children}
    </div>
  )
}
