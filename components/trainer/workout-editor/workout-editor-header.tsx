"use client"

import { PlanEditorHeader } from "@/components/shared/plan-editor-header"
import type { WorkoutPlanData } from "@/services/workout.service"

interface WorkoutEditorHeaderProps {
  plan: WorkoutPlanData
  memberId: number
  isActivating: boolean
  onActivate: () => void
}

export function WorkoutEditorHeader({
  plan,
  memberId,
  isActivating,
  onActivate,
}: WorkoutEditorHeaderProps) {
  return (
    <PlanEditorHeader
      name={plan.name}
      description={plan.description}
      memberName={plan.memberName}
      status={plan.status}
      memberId={memberId}
      isActivating={isActivating}
      canActivate={(plan.workoutDays?.length ?? 0) > 0}
      onActivate={onActivate}
    />
  )
}