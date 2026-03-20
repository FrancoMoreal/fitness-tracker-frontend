import { getAllCatalogExercises } from "@/services/admin.service"
import { AdminExercisesClient } from "@/components/admin/admin-exercises-client"

export default async function AdminExercisesPage() {
  const exercises = await getAllCatalogExercises()
  return <AdminExercisesClient initialExercises={exercises} />
}