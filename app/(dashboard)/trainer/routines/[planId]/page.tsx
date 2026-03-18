import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { getMyTrainerProfile } from "@/services/trainer.service"
import { getCatalogExercises, getCustomExercisesByTrainer } from "@/services/exercise.service"
import { WorkoutEditorClient } from "@/components/trainer/workout-editor/workout-editor-client"
import type { WorkoutPlanData } from "@/services/workout.service"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get("fitness_tracker_token")?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function getWorkoutPlan(planId: number): Promise<WorkoutPlanData | null> {
  try {
    const res = await fetch(`${API_URL}/api/workout-plans/${planId}`, {
      headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
      cache: "no-store",
    })
    if (!res.ok) return null
    return (await res.json()) as WorkoutPlanData
  } catch {
    return null
  }
}

interface WorkoutPlanEditorPageProps {
  params: Promise<{ planId: string }>
}

export default async function WorkoutPlanEditorPage({ params }: WorkoutPlanEditorPageProps) {
  const { planId } = await params
  const id = Number(planId)
  if (isNaN(id)) notFound()

  const [plan, trainer] = await Promise.all([
    getWorkoutPlan(id),
    getMyTrainerProfile(),
  ])

  if (!plan || !trainer) notFound()

  // Verificar que el plan pertenece al trainer
  if (plan.trainerId !== trainer.id) notFound()

  const [catalogExercises, customExercises] = await Promise.all([
    getCatalogExercises(),
    getCustomExercisesByTrainer(trainer.id),
  ])

  const allExercises = [...catalogExercises, ...customExercises]

  return (
    <WorkoutEditorClient
      plan={plan}
      trainerId={trainer.id}
      memberId={plan.memberId}
      exercises={allExercises}
    />
  )
}