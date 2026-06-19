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
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:px-10 lg:px-12">
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Publica</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Nueva publicación</h1>
        <p className="mt-1.5 text-sm text-gray-500">Llena los detalles de tu artículo y empieza a vender.</p>
      </div>
      <ProductForm
        categorias={categorias}
        disponibilidades={disponibilidades}
        userId={Number(session?.user?.id)}
      />
    </main>
  )
}
