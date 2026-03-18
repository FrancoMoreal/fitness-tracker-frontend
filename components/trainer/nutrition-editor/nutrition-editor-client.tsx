"use client"

import { useState } from "react"
import { useNutritionEditor } from "@/hooks/use-nutrition-editor"
import { PlanEditorHeader } from "@/components/shared/plan-editor-header"
import { AddMealForm } from "@/components/trainer/nutrition-editor/add-meal-form"
import { NutritionMealItem } from "@/components/trainer/nutrition-editor/nutrition-meal-item"
import type { NutritionPlanData, NutritionMealData } from "@/services/nutrition.service"

interface NutritionEditorClientProps {
  plan: NutritionPlanData
  trainerId: number
}

export function NutritionEditorClient({ plan, trainerId }: NutritionEditorClientProps) {
  const { isActive, loadingAction, handleAddMeal, handleRemoveMeal, handleActivate } =
    useNutritionEditor({ planId: plan.id, planStatus: plan.status, trainerId })

  const [localMeals, setLocalMeals] = useState<NutritionMealData[]>(
    (plan.meals ?? []).slice().sort((a, b) => a.orderInPlan - b.orderInPlan)
  )

  const handleAdd = async (form: Parameters<typeof handleAddMeal>[0]) => {
    const created = await handleAddMeal(form)
    if (created) {
      setLocalMeals((prev) =>
        [...prev, created].sort((a, b) => a.orderInPlan - b.orderInPlan)
      )
      return created
    }
    return null
  }

  const handleRemove = async (mealId: number) => {
    const success = await handleRemoveMeal(mealId)
    if (success) {
      setLocalMeals((prev) => prev.filter((m) => m.id !== mealId))
    }
  }

  return (
    <div className="space-y-6">
      <PlanEditorHeader
        name={plan.name}
        description={plan.description}
        memberName={plan.memberName}
        status={plan.status}
        memberId={plan.memberId}
        isActivating={loadingAction === "activate"}
        canActivate={localMeals.length > 0}
        onActivate={handleActivate}
      />

      {/* Lista de comidas */}
      <div className="space-y-2">
        {localMeals.length === 0 ? (
          <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
            Sin comidas cargadas. Agregá una para empezar.
          </p>
        ) : (
          localMeals.map((meal, idx) => (
            <NutritionMealItem
              key={meal.id}
              meal={meal}
              index={idx}
              isReadOnly={isActive}
              isRemoving={loadingAction === `remove-meal-${meal.id}`}
              onRemove={handleRemove}
            />
          ))
        )}
      </div>

      {/* Agregar comida */}
      {!isActive && (
        <AddMealForm
          nextOrder={localMeals.length + 1}
          isLoading={loadingAction === "add-meal"}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}