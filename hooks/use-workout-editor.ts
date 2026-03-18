"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import type { WorkoutPlanData, WorkoutExerciseData } from "@/services/workout.service"

interface UseWorkoutEditorProps {
  plan: WorkoutPlanData
  trainerId: number
}

interface AddDayForm {
  dayName: string
  dayNumber: number
  notes: string
}

interface AddExerciseForm {
  exerciseId: number
  sets: number
  reps: number
  weight?: number
  restSeconds?: number
  orderInWorkout: number
  notes: string
}

export function useWorkoutEditor({ plan, trainerId }: UseWorkoutEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const isActive = plan.status === "ACTIVE"

  const handleAddDay = async (form: AddDayForm) => {
    if (!form.dayName.trim()) {
      toast.error("El nombre del día es obligatorio")
      return false
    }
    setLoadingAction("add-day")
    try {
      const response = await api.post(
        `/api/workout-plans/${plan.id}/days?trainerId=${trainerId}`,
        {
          dayName:   form.dayName.trim(),
          dayNumber: form.dayNumber,
          notes:     form.notes.trim() || undefined,
        }
      )
      if (!response.success) {
        toast.error("Error al agregar día", { description: response.error })
        return false
      }
      toast.success("Día agregado")
      startTransition(() => router.refresh())
      return true
    } catch {
      toast.error("Error de conexión")
      return false
    } finally {
      setLoadingAction(null)
    }
  }

  // Devuelve el WorkoutExerciseData creado o null si falla
  const handleAddExercise = async (
    dayId: number,
    form: AddExerciseForm
  ): Promise<WorkoutExerciseData | null> => {
    setLoadingAction(`add-exercise-${dayId}`)
    try {
      const response = await api.post<WorkoutExerciseData>(
        `/api/workout-plans/days/${dayId}/exercises?trainerId=${trainerId}`,
        {
          exerciseId:     form.exerciseId,
          sets:           form.sets,
          reps:           form.reps,
          weight:         form.weight || undefined,
          restSeconds:    form.restSeconds || undefined,
          orderInWorkout: form.orderInWorkout,
          notes:          form.notes.trim() || undefined,
        }
      )

      if (!response.success || !response.data) {
        toast.error("Error al agregar ejercicio", { description: response.error })
        return null
      }
      toast.success("Ejercicio agregado")
      return response.data
    } catch {
      toast.error("Error de conexión")
      return null
    } finally {
      setLoadingAction(null)
    }
  }

  const handleRemoveExercise = async (workoutExerciseId: number): Promise<boolean> => {
    setLoadingAction(`remove-exercise-${workoutExerciseId}`)
    try {
      const response = await api.delete(
        `/api/workout-plans/exercises/${workoutExerciseId}?trainerId=${trainerId}`
      )
      if (!response.success) {
        toast.error("Error al eliminar ejercicio", { description: response.error })
        return false
      }
      toast.success("Ejercicio eliminado")
      return true
    } catch {
      toast.error("Error de conexión")
      return false
    } finally {
      setLoadingAction(null)
    }
  }

  const handleActivate = async () => {
    setLoadingAction("activate")
    try {
      const response = await api.post(
        `/api/workout-plans/${plan.id}/activate?trainerId=${trainerId}`
      )
      if (!response.success) {
        toast.error("Error al activar plan", { description: response.error })
        return
      }
      toast.success("Plan activado", {
        description: "El miembro ya puede ver su plan de workout.",
      })
      startTransition(() => router.refresh())
    } catch {
      toast.error("Error de conexión")
    } finally {
      setLoadingAction(null)
    }
  }

  return {
    isActive,
    isPending,
    loadingAction,
    handleAddDay,
    handleAddExercise,
    handleRemoveExercise,
    handleActivate,
  }
}