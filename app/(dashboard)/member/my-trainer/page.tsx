import { redirect } from "next/navigation"
import { getMyMemberProfile } from "@/services/member.service"
import { getTrainerById } from "@/services/trainer.service"
import { MyTrainerCard } from "@/components/member/my-trainer-card"
import { EmptyState } from "@/components/shared/empty-state"
import { UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function MyTrainerPage() {
  const member = await getMyMemberProfile()

  // Si no tiene trainer activo, redirigir a buscar entrenador
  if (!member || member.assignmentStatus !== "ACTIVE") {
    redirect("/member/trainers")
  }

  const trainer = member.assignedTrainerId
    ? await getTrainerById(member.assignedTrainerId)
    : null

  if (!trainer) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Mi entrenador</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Información de tu entrenador asignado.
          </p>
        </div>
        <EmptyState
          icon={<UserX className="h-8 w-8" />}
          title="No se pudo cargar el entrenador"
          description="Ocurrió un error al obtener la información. Intentá de nuevo más tarde."
          action={
            <Button asChild variant="outline">
              <Link href="/dashboard">Volver al inicio</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Mi entrenador</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Información de tu entrenador asignado.
        </p>
      </div>

      <MyTrainerCard trainer={trainer} memberId={member.id} />
    </div>
  )
}