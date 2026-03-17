import { getMyMemberProfile } from "@/services/member.service"
import { getActiveNutritionPlansByMember } from "@/services/nutrition.service"
import { NutritionPlanCard } from "@/components/member/nutrition/nutrition-plan-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function MemberNutritionPage() {
  const member = await getMyMemberProfile()
  const plans = member ? await getActiveNutritionPlansByMember(member.id) : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Plan alimenticio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tu plan nutricional activo asignado por tu entrenador.
        </p>
      </div>

      {plans.length === 0 ? (
        <EmptyState
          icon={<Utensils className="h-8 w-8" />}
          title="Sin plan alimenticio activo"
          description={
            member?.assignmentStatus === "ACTIVE"
              ? "Tu entrenador todavía no te asignó ningún plan nutricional. Volvé más tarde."
              : "Necesitás tener un entrenador asignado para ver tu plan alimenticio."
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
            <NutritionPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  )
}