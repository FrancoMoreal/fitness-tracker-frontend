import { cookies } from "next/headers"
import type { ExerciseData } from "../types/exercise.types"

export type { ExerciseData, ExerciseCategory, MuscleGroup, DifficultyLevel } from "../types/exercise.types"
export { CATEGORY_LABELS, MUSCLE_LABELS, DIFFICULTY_LABELS } from "../types/exercise.types"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get("fitness_tracker_token")?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getCatalogExercises(): Promise<ExerciseData[]> {
  try {
    const res = await fetch(`${API_URL}/api/exercises/catalog`, {
      headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
      cache: "no-store",
    })
    if (!res.ok) return []
    return (await res.json()) as ExerciseData[]
  } catch {
    return []
  }
}

export async function getCustomExercisesByTrainer(trainerId: number): Promise<ExerciseData[]> {
  try {
    const res = await fetch(`${API_URL}/api/exercises/trainers/${trainerId}/custom`, {
      headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
      cache: "no-store",
    })
    if (!res.ok) return []
    return (await res.json()) as ExerciseData[]
  } catch {
    return []
  }
}
