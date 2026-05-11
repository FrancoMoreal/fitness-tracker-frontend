import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

export interface ExerciseLogDetail {
  id: number
  exerciseName: string
  setsCompleted: number
  repsCompleted: number
  weightUsed?: number
  notes?: string
}

export interface WorkoutCompletionData {
  id: number
  externalId: string
  memberId: number
  memberName: string
  workoutDayId: number
  workoutDayName: string
  completedAt: string
  rating?: number
  notes?: string
  exerciseLogs?: ExerciseLogDetail[]
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get("fitness_tracker_token")?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getWorkoutHistory(memberId: number): Promise<WorkoutCompletionData[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/workout-plans/members/${memberId}/history`,
      {
        headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
        cache: "no-store",
      }
    )
    if (!res.ok) return []
    return (await res.json()) as WorkoutCompletionData[]
  } catch {
    return []
  }
}