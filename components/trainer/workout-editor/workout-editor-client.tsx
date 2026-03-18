"use client"

import { useWorkoutEditor } from "@/hooks/use-workout-editor"
import { WorkoutEditorHeader } from "@/components/trainer/workout-editor/workout-editor-header"
import { AddDayForm } from "@/components/trainer/workout-editor/add-day-form"
import { WorkoutDayItem } from "@/components/trainer/workout-editor/workout-day-item"
import type { WorkoutPlanData } from "@/services/workout.service"
import type { ExerciseData } from "@/services/exercise.service"

interface WorkoutEditorClientProps {
  plan: WorkoutPlanData
  trainerId: number
  memberId: number
  exercises: ExerciseData[]
}

export function WorkoutEditorClient({ plan, trainerId, memberId, exercises }: WorkoutEditorClientProps) {
  const {
    isEditable,
    loadingAction,
    handleAddDay,
    handleAddExercise,
    handleRemoveExercise,
    handleActivate,
    handleCancel,
  } = useWorkoutEditor({ plan, trainerId })

  const days = (plan.workoutDays ?? []).slice().sort((a, b) => a.dayNumber - b.dayNumber)
  const nextDayNumber = days.length + 1

  return (
    <div className="space-y-6">
      <WorkoutEditorHeader
        plan={plan}
        memberId={memberId}
        isActivating={loadingAction === "activate"}
        isCancelling={loadingAction === "cancel"}
        onActivate={handleActivate}
        onCancel={handleCancel}
      />
      <div className="space-y-4">
        {days.map((day) => (
          <WorkoutDayItem
            key={day.id}
            day={day}
            exercises={exercises}
            isReadOnly={!isEditable}
            isAddingExercise={loadingAction === `add-exercise-${day.id}`}
            isRemovingExercise={loadingAction}
            onAddExercise={handleAddExercise}
            onRemoveExercise={handleRemoveExercise}     
          />  
        ))}
        
      </div>

      {isEditable && (
        <AddDayForm
          nextDayNumber={nextDayNumber}
          isLoading={loadingAction === "add-day"}
          onAdd={handleAddDay}
        />
      )}

      {!isEditable && days.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Este plan no tiene días cargados.
        </p>
      )}
    </div>
  )
}