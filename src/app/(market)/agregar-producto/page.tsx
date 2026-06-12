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
    <main className="relative mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 md:px-10 lg:px-12">
      <div className="mb-8 rounded-[28px] border border-white/10 bg-[#231f39]/90 p-8 shadow-[0_30px_90px_rgba(10,10,30,0.35)] backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-indigo-100/80">Publica</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Nueva publicación</h1>
        <p className="mt-3 text-sm text-slate-200/95 sm:text-base">Llena los detalles de tu artículo con una interfaz alineada a la experiencia de login y register.</p>
      </div>
      <ProductForm
        categorias={categorias}
        disponibilidades={disponibilidades}
        userId={Number(session?.user?.id)}
      />
    </main>
  )
}