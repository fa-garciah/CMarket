import { getComunidadesAction, getUsuariosAction } from "@/features/master/actions"
import MasterDashboard from "@/features/master/components/MasterDashboard"

export default async function MasterDashboardPage() {
  const [comunidades, usuarios] = await Promise.all([
    getComunidadesAction(),
    getUsuariosAction(),
  ])

  return (
    <MasterDashboard comunidades={comunidades} usuarios={usuarios} />
  )
}
