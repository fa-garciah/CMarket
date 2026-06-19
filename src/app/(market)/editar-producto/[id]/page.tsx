import { auth } from "@/server/auth"
import { getProductForEdit, getCategorias, getDisponibilidades } from "@/server/services/productService"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import EditProductForm from "@/features/products/components/EditProductForm"

type Props = { params: Promise<{ id: string }> }

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params
  const [session, producto, categorias, disponibilidades] = await Promise.all([
    auth(),
    getProductForEdit(Number(id)),
    getCategorias(),
    getDisponibilidades(),
  ])

  if (!session) redirect("/login")
  if (!producto) notFound()
  if (producto.idusuario !== Number(session.user.id)) redirect("/profile")

  return (
    <div className="mx-auto w-full max-w-5xl p-6 sm:p-8 lg:p-10">
      <Link
        href="/profile"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={14} />
        Volver a mis productos
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Editar producto</h1>
        <p className="mt-1 text-sm text-gray-500">{producto.nombreproducto}</p>
      </div>

      <EditProductForm
        idproducto={producto.idproducto}
        categorias={categorias}
        disponibilidades={disponibilidades}
        defaultValues={{
          nombreproducto:   producto.nombreproducto,
          descripcion:      producto.descripcion ?? "",
          idcategoria:      producto.idcategoria,
          iddisponibilidad: producto.iddisponibilidad,
          precio:           Number(producto.precio),
          stock:            producto.stock,
          fotourl:          producto.fotourl,
        }}
      />
    </div>
  )
}
