"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import type { ExerciseData } from "@/types/exercise.types"

interface UseExercisesProps {
  trainerId: number
  initialExercises: ExerciseData[]
}

export interface CreateExerciseForm {
  name: string
  description: string
  category: string
  primaryMuscle: string
  difficulty: string
  equipment: string
  instructions: string
}

export const INITIAL_EXERCISE_FORM: CreateExerciseForm = {
  name:         "",
  description:  "",
  category:     "",
  primaryMuscle:"",
  difficulty:   "",
  equipment:    "",
  instructions: "",
}

export function useExercises({ trainerId, initialExercises }: UseExercisesProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [exercises, setExercises] = useState<ExerciseData[]>(initialExercises)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const handleCreate = async (form: CreateExerciseForm): Promise<boolean> => {
    if (!form.name.trim())     { toast.error("El nombre es obligatorio");      return false }
    if (!form.category)        { toast.error("La categoría es obligatoria");   return false }
    if (!form.primaryMuscle)   { toast.error("El músculo es obligatorio");     return false }
    if (!form.difficulty)      { toast.error("La dificultad es obligatoria");  return false }

    setLoadingAction("create")
    try {
      const response = await api.post<ExerciseData>(
        `/api/exercises/custom?trainerId=${trainerId}`,
        {
          name:         form.name.trim(),
          description:  form.description.trim()  || undefined,
          category:     form.category,
          primaryMuscle: form.primaryMuscle,
          difficulty:   form.difficulty,
          equipment:    form.equipment.trim()     || undefined,
          instructions: form.instructions.trim()  || undefined,
        }
      )

      if (!response.success || !response.data) {
        toast.error("Error al crear ejercicio", { description: response.error })
        return false
      }

      setExercises((prev) => [response.data!, ...prev])
      toast.success("Ejercicio creado")
      return true
    } catch {
      toast.error("Error de conexión")
      return false
    } finally {
      setLoadingAction(null)
    }
  }

  const handleDelete = async (exerciseId: number): Promise<void> => {
    setLoadingAction(`delete-${exerciseId}`)
    try {
      const response = await api.delete(
        `/api/exercises/${exerciseId}?trainerId=${trainerId}`
      )

      if (!response.success) {
        toast.error("Error al eliminar ejercicio", { description: response.error })
        return
      }

      setExercises((prev) => prev.filter((e) => e.id !== exerciseId))
      toast.success("Ejercicio eliminado")
    } catch {
      toast.error("Error de conexión")
    } finally {
      setLoadingAction(null)
    }
  }

  return {
    exercises,
    loadingAction,
    isPending,
    handleCreate,
    handleDelete,
  }
}