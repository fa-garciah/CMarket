import z from "zod"

export const createProductSchema = z.object({
  nombreproducto: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  idcategoria: z.number({ message: "Selecciona una categoría" }).min(1, "Selecciona una categoría"),
  iddisponibilidad: z.number({ message: "Selecciona una disponibilidad" }).min(1, "Selecciona una disponibilidad"),
  precio: z.number({ message: "Ingresa un precio válido" }).min(0.01, "El precio debe ser mayor a 0"),
  stock: z.number({ message: "Ingresa un stock válido" }).int().min(0, "El stock no puede ser negativo"),
})

export type ProductFormValues = z.infer<typeof createProductSchema>

export type CreateProductDTO = ProductFormValues & {
  idusuario: number
  imageUrl?: string
}

export type ProductCardDTO = {
  idproducto: number
  nombreproducto: string
  precio: number
  fotoproducto: boolean
  fotourl: string | null
  vendedor: { nombre: string }
  categoria: { nombrecategoria: string }
}

export type ProductDetailDTO = {
  idproducto: number
  nombreproducto: string
  precio: number
  fotoproducto: boolean
  fotourl: string | null
  descripcion: string | null
  stock: number
  vendedor: { nombre: string, telefono: string }
  categoria: { nombrecategoria: string }
}