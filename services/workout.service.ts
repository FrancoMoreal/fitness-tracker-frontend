import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type WorkoutPlanStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED"

export interface WorkoutExerciseData {
  id: number
  externalId: string
  exerciseId: number
  exerciseName: string
  sets: number
  reps: number
  weight?: number
  restSeconds?: number
  orderInWorkout: number
  notes?: string
}

export interface WorkoutDayData {
  id: number
  externalId: string
  dayName: string
  dayNumber: number
  notes?: string
  totalExercises?: number
  exercises?: WorkoutExerciseData[]
}

export interface WorkoutPlanData {
  id: number
  externalId: string
  name: string
  description?: string
  memberId: number
  memberName?: string
  trainerId: number
  trainerName?: string
  status: WorkoutPlanStatus
  startDate: string
  endDate?: string
  notes?: string
  totalDays?: number
  createdAt: string
  updatedAt?: string
  workoutDays?: WorkoutDayData[]
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get("fitness_tracker_token")?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ── Fetches ───────────────────────────────────────────────────────────────────

/**
 * Obtiene planes activos del member con detalle completo (días + ejercicios).
 * Usa /members/{memberId}/active que devuelve withDays=true.
 */
export async function getActivePlansByMember(memberId: number): Promise<WorkoutPlanData[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/workout-plans/members/${memberId}/active`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(await getAuthHeader()),
        },
        cache: "no-store",
      }
    )
    if (!response.ok) return []
    return (await response.json()) as WorkoutPlanData[]
  } catch {
    return []
  }
}

export async function getAllPlansByMember(memberId: number): Promise<WorkoutPlanData[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/workout-plans/members/${memberId}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(await getAuthHeader()),
        },
        cache: "no-store",
      }
    )
    if (!response.ok) return []
    return (await response.json()) as WorkoutPlanData[]
  } catch {
    return []
  }
}