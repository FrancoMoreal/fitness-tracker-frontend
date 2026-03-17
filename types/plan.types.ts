/**
 * Respuestas de planes de workout
 */
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

/**
 * Respuestas de planes nutricionales
 */
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

/**
 * Tipo unión para cualquier plan
 */
export type PlanResponse = WorkoutPlanResponse | NutritionPlanResponse

/**
 * Requestencias para crear planes
 */
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
