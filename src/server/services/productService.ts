import { prisma } from "@/server/db/db"
import { CreateProductDTO } from "@/types/product.types"


export async function getProducts() {
  return prisma.producto.findMany({
    where: { isactive: 1 },
    include: {
      vendedor: { select: { nombre: true } },
      categoria: { select: { nombrecategoria: true } },
    }
  })
}

export async function getProductById(id: number) {
  return prisma.producto.findUnique({
    where: { idproducto: id },
    select: {
      idproducto: true,
      idusuario: true,
      nombreproducto: true,
      precio: true,
      fotoproducto: true,
      fotourl: true,
      descripcion: true,
      stock: true,
      vendedor: { select: { nombre: true, telefono: true } },
      categoria: { select: { nombrecategoria: true } },
    }
  })
}

export async function getProductsPicture(id: number) {
  return prisma.producto.findUnique({
    where: { idproducto: id },
    select: { fotoproducto: true }
  })
}

export async function getProductsByUser(id: number) {
  return prisma.producto.findMany({
    where: {idusuario: id, isactive: 1},
    include:{
      vendedor: { select: { nombre: true } },
      categoria: { select: { nombrecategoria: true } },
    }
  })
}

export async function getCategorias() {
  return prisma.categoria.findMany()
}

export async function getDisponibilidades() {
  return prisma.disponibilidad.findMany()
}

export async function createProduct(data: CreateProductDTO) {
  return prisma.producto.create({
    data: {
      nombreproducto: data.nombreproducto,
      descripcion: data.descripcion,
      idcategoria: Number(data.idcategoria),
      iddisponibilidad: Number(data.iddisponibilidad),
      precio: Number(data.precio),
      stock: parseInt(String(data.stock)),
      idusuario: data.idusuario,
      fotoproducto: null,
      fotourl: data.imageUrl ?? null,
      fechapublicacion: new Date(),
      isactive: 1,
    }
  })
}