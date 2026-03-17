import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { getMemberById } from "@/services/member.service"
import { getMyTrainerProfile } from "@/services/trainer.service"
import { MemberInfoCard } from "@/components/trainer/member-profile/member-info-card"
import { MemberPlansSection } from "@/components/trainer/member-profile/member-plans-section"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import type { WorkoutPlanData } from "@/services/workout.service"
import type { NutritionPlanData } from "@/services/nutrition.service"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get("fitness_tracker_token")?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function getWorkoutPlans(memberId: number): Promise<WorkoutPlanData[]> {
  try {
    const res = await fetch(`${API_URL}/api/workout-plans/members/${memberId}`, {
      headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
      cache: "no-store",
    })
    if (!res.ok) return []
    return (await res.json()) as WorkoutPlanData[]
  } catch {
    return []
  }
}

async function getNutritionPlans(memberId: number): Promise<NutritionPlanData[]> {
  try {
    const res = await fetch(`${API_URL}/api/nutrition-plans/members/${memberId}`, {
      headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
      cache: "no-store",
    })
    if (!res.ok) return []
    return (await res.json()) as NutritionPlanData[]
  } catch {
    return []
  }
}

interface MemberProfilePageProps {
  params: Promise<{ memberId: string }>
}

export default async function MemberProfilePage({ params }: MemberProfilePageProps) {
  const { memberId } = await params
  const id = Number(memberId)

  if (isNaN(id)) notFound()

  const [member, trainer] = await Promise.all([
    getMemberById(id),
    getMyTrainerProfile(),
  ])

  if (!member || !trainer) notFound()

  if (member.assignedTrainerId !== trainer.id) notFound()

  const [workoutPlans, nutritionPlans] = await Promise.all([
    getWorkoutPlans(id),
    getNutritionPlans(id),
  ])

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/trainer/members">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Mis miembros
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">Perfil del miembro</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Información personal y planes asignados.
        </p>
      </div>

      <div className="mx-auto max-w-lg">
        <MemberInfoCard member={member} />
      </div>

      <div className="border-t" />

      <MemberPlansSection
        type="workout"
        plans={workoutPlans}
        trainerId={trainer.id}
        memberId={id}
      />

      <div className="border-t" />

      <MemberPlansSection
        type="nutrition"
        plans={nutritionPlans}
        trainerId={trainer.id}
        memberId={id}
      />
    </div>
  )
}