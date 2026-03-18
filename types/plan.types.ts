
export interface WorkoutPlanResponse {
  id: number
  name: string
  description?: string
  memberId: number
  trainerId: number
  startDate: string
  endDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}


export interface NutritionPlanResponse {
  id: number
  name: string
  description?: string
  memberId: number
  trainerId: number
  startDate: string
  endDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export type PlanResponse = WorkoutPlanResponse | NutritionPlanResponse


export interface CreateWorkoutPlanRequest {
  name: string
  description?: string
  memberId: number
  startDate: string
  endDate?: string
  notes?: string
}

export interface CreateNutritionPlanRequest {
  name: string
  description?: string
  memberId: number
  startDate: string
  endDate?: string
  notes?: string
}
