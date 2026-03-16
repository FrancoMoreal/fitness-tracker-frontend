import { getMyMemberProfile } from "@/services/member.service"
import { getActivePlansByMember } from "@/services/workout.service"
import { WorkoutPlanCard } from "@/components/member/routines/workout-plan-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Dumbbell } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function MemberRoutinesPage() {
  const member = await getMyMemberProfile()
  const plans = member ? await getActivePlansByMember(member.id) : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Mis rutinas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tus planes de entrenamiento activos asignados por tu entrenador.
        </p>
      </div>

      {plans.length === 0 ? (
        <EmptyState
          icon={<Dumbbell className="h-8 w-8" />}
          title="Sin rutinas activas"
          description={
            member?.assignmentStatus === "ACTIVE"
              ? "Tu entrenador todavía no te asignó ningún plan. Volvé más tarde."
              : "Necesitás tener un entrenador asignado para ver tus rutinas."
          }
          action={
            member?.assignmentStatus !== "ACTIVE" ? (
              <Button asChild variant="outline">
                <Link href="/member/trainers">Buscar entrenador</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-6">
          {plans.map((plan) => (
            <WorkoutPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  )
}