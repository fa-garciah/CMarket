import { getProducts } from "@/server/services/productService"
import { auth } from "@/server/auth"
import ProductsGrid from "@/features/products/components/ProductsGrid"

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ search?: string, category?: string }>
}) {
  const { search, category } = await searchParams

  const [products, session] = await Promise.all([
    getProducts(),
    auth()
  ])

  const serializedProducts = products.map((prod) => ({
    ...prod,
    precio: Number(prod.precio),
    fotoproducto: prod.fotoproducto ? true : false,
    fechapublicacion: prod.fechapublicacion.toISOString(),
  }))

  const filteredProducts = serializedProducts.filter(prod => {
    const matchesSearch = search
      ? prod.nombreproducto.toLowerCase().includes(search.toLowerCase())
      : true

    const matchesCategory = category
      ? prod.categoria.nombrecategoria.toLowerCase() === category.toLowerCase()
      : true

    return matchesSearch && matchesCategory
  })

  return (
    <ProductsGrid
      products={filteredProducts}
      userName={session?.user?.name}
    />
  )
}