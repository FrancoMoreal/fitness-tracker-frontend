import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get("fitness_tracker_token")?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function fetchNumber(url: string): Promise<number> {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
      cache: "no-store",
    })
    if (!res.ok) return 0
    const data = await res.json()
    return typeof data === "number" ? data : 0
  } catch {
    return 0
  }
}

async function fetchArray(url: string): Promise<unknown[]> {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
      cache: "no-store",
    })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

// ── Member stats ──────────────────────────────────────────────────────────────

export interface MemberDashboardStats {
  completedWorkouts: number
  activeWorkoutPlans: number
  activeNutritionPlans: number
  recentHistory: {
    id: number
    workoutDayName: string
    completedAt: string
    rating?: number
  }[]
}

export async function getMemberDashboardStats(memberId: number): Promise<MemberDashboardStats> {
  const [completedWorkouts, activeWorkoutPlans, activeNutritionPlans, recentHistory] =
    await Promise.all([
      fetchNumber(`${API_URL}/api/workout-plans/members/${memberId}/stats/completed-count`),
      fetchArray(`${API_URL}/api/workout-plans/members/${memberId}/active`),
      fetchArray(`${API_URL}/api/nutrition-plans/members/${memberId}/active`),
      fetchArray(`${API_URL}/api/workout-plans/members/${memberId}/history`),
    ])

  return {
    completedWorkouts,
    activeWorkoutPlans: activeWorkoutPlans.length,
    activeNutritionPlans: activeNutritionPlans.length,
    recentHistory: (recentHistory as any[]).slice(0, 5).map((h) => ({
      id:             h.id,
      workoutDayName: h.workoutDayName,
      completedAt:    h.completedAt,
      rating:         h.rating,
    })),
  }
}

// ── Trainer stats ─────────────────────────────────────────────────────────────

export interface TrainerDashboardStats {
  activeMembers: number
  pendingRequests: number
  activeWorkoutPlans: number
  activeNutritionPlans: number
}

export async function getTrainerDashboardStats(trainerId: number): Promise<TrainerDashboardStats> {
  const [activeMembers, pendingRequests, activeWorkoutPlans, activeNutritionPlans] =
    await Promise.all([
      fetchArray(`${API_URL}/api/members/trainer/${trainerId}`),
      fetchNumber(`${API_URL}/api/trainer-assignments/trainers/${trainerId}/pending-count`),
      fetchNumber(`${API_URL}/api/workout-plans/trainers/${trainerId}/stats/active-count`),
      fetchNumber(`${API_URL}/api/nutrition-plans/trainers/${trainerId}/stats/active-count`),
    ])

  return {
    activeMembers:       activeMembers.length,
    pendingRequests,
    activeWorkoutPlans,
    activeNutritionPlans,
  }
}