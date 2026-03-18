import { notFound } from "next/navigation"
import { getMyTrainerProfile } from "@/services/trainer.service"
import { PlansList, type PlanSummary } from "@/components/trainer/plans/plans-list"
import { cookies } from "next/headers"
import type { NutritionPlanData } from "@/services/nutrition.service"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get("fitness_tracker_token")?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function getNutritionPlansByTrainer(trainerId: number): Promise<NutritionPlanData[]> {
  try {
    const res = await fetch(`${API_URL}/api/nutrition-plans/trainers/${trainerId}`, {
      headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
      cache: "no-store",
    })
    if (!res.ok) return []
    return (await res.json()) as NutritionPlanData[]
  } catch {
    return []
  }
}

export default async function TrainerNutritionPage() {
  const trainer = await getMyTrainerProfile()
  if (!trainer) notFound()

  const plans = await getNutritionPlansByTrainer(trainer.id)

  const planSummaries: PlanSummary[] = plans.map((p) => ({
    id:          p.id,
    name:        p.name,
    description: p.description,
    memberName:  p.memberName,
    status:      p.status,
    startDate:   p.startDate,
    endDate:     p.endDate,
    totalItems:  p.totalMeals,
  }))

  const ORDER = { DRAFT: 0, ACTIVE: 1, COMPLETED: 2, CANCELLED: 3 }
  planSummaries.sort((a, b) => (ORDER[a.status as keyof typeof ORDER] ?? 4) - (ORDER[b.status as keyof typeof ORDER] ?? 4))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Planes alimenticios</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todos los planes nutricionales que creaste para tus miembros.
        </p>
      </div>

      <PlansList type="nutrition" plans={planSummaries} />
    </div>
  )
}