"use client"

import { useRouter } from "next/navigation"
import EditComunidadForm from "@/features/master/components/EditComunidadForm"

type Props = {
  idcomunidad: number
  nombre: string
  descripcion?: string | null
}

export default function EditComunidadPageWrapper({ idcomunidad, nombre, descripcion }: Props) {
  const router = useRouter()
  return (
    <EditComunidadForm
      idcomunidad={idcomunidad}
      nombre={nombre}
      descripcion={descripcion}
      onCancel={() => router.push("/master/comunidades")}
      onSaved={() => router.push("/master/comunidades")}
    />
  )
}
