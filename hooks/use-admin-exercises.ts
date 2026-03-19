"use client"

import { useState } from "react"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import type { CreateExerciseForm } from "@/hooks/use-exercises"

export interface CatalogExercise {
  id: number
  name: string
  category: string
  primaryMuscle: string
  difficulty: string
  isCustom: boolean
}

export function useAdminExercises(initialExercises: CatalogExercise[]) {
  const [exercises, setExercises] = useState<CatalogExercise[]>(initialExercises)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const handleCreate = async (form: CreateExerciseForm): Promise<boolean> => {
    if (!form.name.trim() || !form.category || !form.primaryMuscle || !form.difficulty) {
      toast.error("Completá los campos obligatorios")
      return false
    }

    setLoadingAction("create")
    try {
      const response = await api.post<CatalogExercise>("/api/exercises/catalog", {
        name:          form.name.trim(),
        description:   form.description.trim()  || undefined,
        category:      form.category,
        primaryMuscle: form.primaryMuscle,
        difficulty:    form.difficulty,
        equipment:     form.equipment.trim()     || undefined,
        instructions:  form.instructions.trim()  || undefined,
      })

      if (!response.success || !response.data) {
        toast.error("Error al crear ejercicio", { description: response.error })
        return false
      }

      setExercises((prev) => [response.data!, ...prev])
      toast.success("Ejercicio agregado al catálogo")
      return true
    } catch {
      toast.error("Error de conexión")
      return false
    } finally {
      setLoadingAction(null)
    }
  }

  const handleDelete = async (exerciseId: number, trainerId = 0): Promise<void> => {
    setLoadingAction(`delete-${exerciseId}`)
    try {
      const response = await api.delete(`/api/exercises/${exerciseId}?trainerId=${trainerId}`)
      if (!response.success) {
        toast.error("Error al eliminar ejercicio", { description: response.error })
        return
      }
      setExercises((prev) => prev.filter((e) => e.id !== exerciseId))
      toast.success("Ejercicio eliminado del catálogo")
    } catch {
      toast.error("Error de conexión")
    } finally {
      setLoadingAction(null)
    }
  }

  return { exercises, loadingAction, handleCreate, handleDelete }
}