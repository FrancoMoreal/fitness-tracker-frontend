"use client"

import { PlanEditorHeader } from "@/components/shared/plan-editor-header"
import type { WorkoutPlanData } from "@/services/workout.service"

interface WorkoutEditorHeaderProps {
  plan: WorkoutPlanData
  memberId: number
  isActivating: boolean
  isCancelling: boolean
  onActivate: () => void
  onCancel: () => void
}

export function WorkoutEditorHeader({
  plan,
  memberId,
  isActivating,
  isCancelling,
  onActivate,
  onCancel,
}: WorkoutEditorHeaderProps) {
  return (
    <PlanEditorHeader
      name={plan.name}
      description={plan.description}
      memberName={plan.memberName}
      status={plan.status}
      memberId={memberId}
      isActivating={isActivating}
      isCancelling={isCancelling}
      canActivate={(plan.workoutDays?.length ?? 0) > 0}
      onActivate={onActivate}
      onCancel={onCancel}
    />
  )
}