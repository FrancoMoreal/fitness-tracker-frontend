"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import type { NutritionMealData } from "@/services/nutrition.service"

interface UseNutritionEditorProps {
  planId: number
  planStatus: string
  trainerId: number
}

export interface AddMealForm {
  mealType: string
  name: string
  calories: string
  protein: string
  carbs: string
  fat: string
  foods: string
  notes: string
  orderInPlan: number
}

export function useNutritionEditor({ planId, planStatus, trainerId }: UseNutritionEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const isActive = planStatus === "ACTIVE"

  const handleAddMeal = async (form: AddMealForm): Promise<NutritionMealData | null> => {
    if (!form.name.trim()) {
      toast.error("El nombre de la comida es obligatorio")
      return null
    }
    if (!form.mealType) {
      toast.error("El tipo de comida es obligatorio")
      return null
    }

    setLoadingAction("add-meal")
    try {
      const response = await api.post<NutritionMealData>(
        `/api/nutrition-plans/${planId}/meals?trainerId=${trainerId}`,
        {
          mealType:   form.mealType,
          name:       form.name.trim(),
          calories:   form.calories   ? Number(form.calories)   : undefined,
          protein:    form.protein    ? Number(form.protein)    : undefined,
          carbs:      form.carbs      ? Number(form.carbs)      : undefined,
          fat:        form.fat        ? Number(form.fat)        : undefined,
          foods:      form.foods.trim()  || undefined,
          notes:      form.notes.trim()  || undefined,
          orderInPlan: form.orderInPlan,
        }
      )

      if (!response.success || !response.data) {
        toast.error("Error al agregar comida", { description: response.error })
        return null
      }

      toast.success("Comida agregada")
      return response.data
    } catch {
      toast.error("Error de conexión")
      return null
    } finally {
      setLoadingAction(null)
    }
  }

  const handleRemoveMeal = async (mealId: number): Promise<boolean> => {
    setLoadingAction(`remove-meal-${mealId}`)
    try {
      const response = await api.delete(
        `/api/nutrition-plans/meals/${mealId}?trainerId=${trainerId}`
      )
      if (!response.success) {
        toast.error("Error al eliminar comida", { description: response.error })
        return false
      }
      toast.success("Comida eliminada")
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
        `/api/nutrition-plans/${planId}/activate?trainerId=${trainerId}`
      )
      if (!response.success) {
        toast.error("Error al activar plan", { description: response.error })
        return
      }
      toast.success("Plan activado", {
        description: "El miembro ya puede ver su plan nutricional.",
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
    handleAddMeal,
    handleRemoveMeal,
    handleActivate,
  }
}