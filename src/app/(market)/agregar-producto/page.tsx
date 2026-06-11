import { auth } from "@/server/auth"
import { getCategorias, getDisponibilidades } from "@/server/services/productService"
import ProductForm from "@/features/products/components/ProductForm"

export default async function AgregarProductoPage() {
  const [categorias, disponibilidades, session] = await Promise.all([
    getCategorias(),
    getDisponibilidades(),
    auth()
  ])

  return (
    <main className="max-w-6xl mx-auto p-6 md:p-12">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-800 italic tracking-tighter uppercase">Nueva Publicación</h1>
        <p className="text-gray-500 font-medium">Llena los detalles de tu artículo para la comunidad Anáhuac.</p>
      </div>
      <ProductForm
        categorias={categorias}
        disponibilidades={disponibilidades}
        userId={Number(session?.user?.id)}
      />
    </main>
  )
}