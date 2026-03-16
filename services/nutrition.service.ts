import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"


export type NutritionPlanStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED"

export type MealType =
  | "BREAKFAST"
  | "LUNCH"
  | "DINNER"
  | "SNACK"
  | "PRE_WORKOUT"
  | "POST_WORKOUT"

export interface NutritionMealData {
  id: number
  externalId: string
  mealType: MealType
  name: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  foods?: string
  notes?: string
  orderInPlan: number
}

export interface NutritionPlanData {
  id: number
  externalId: string
  name: string
  description?: string
  memberId: number
  memberName?: string
  trainerId: number
  trainerName?: string
  status: NutritionPlanStatus
  startDate: string
  endDate?: string
  notes?: string
  totalMeals?: number
  createdAt: string
  updatedAt?: string
  meals?: NutritionMealData[]
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get("fitness_tracker_token")?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getActiveNutritionPlansByMember(
  memberId: number
): Promise<NutritionPlanData[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/nutrition-plans/members/${memberId}/active`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(await getAuthHeader()),
        },
        cache: "no-store",
      }
    )
    if (!response.ok) return []
    return (await response.json()) as NutritionPlanData[]
  } catch {
    return []
  }
}