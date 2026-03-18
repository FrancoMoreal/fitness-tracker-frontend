"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AddExerciseDialog } from "@/components/trainer/workout-editor/add-exercise-dialog"
import { Dumbbell, RotateCcw, Timer, Trash2, Loader2 } from "lucide-react"
import type { WorkoutDayData, WorkoutExerciseData } from "@/services/workout.service"
import type { ExerciseData } from "@/services/exercise.service"

interface WorkoutDayItemProps {
  day: WorkoutDayData
  exercises: ExerciseData[]
  isReadOnly: boolean
  isAddingExercise: boolean
  isRemovingExercise: string | null
  onAddExercise: (dayId: number, form: {
    exerciseId: number
    sets: number
    reps: number
    weight?: number
    restSeconds?: number
    orderInWorkout: number
    notes: string
  }) => Promise<WorkoutExerciseData | null>
  onRemoveExercise: (workoutExerciseId: number) => Promise<boolean>
}

export function WorkoutDayItem({
  day,
  exercises,
  isReadOnly,
  isAddingExercise,
  isRemovingExercise,
  onAddExercise,
  onRemoveExercise,
}: WorkoutDayItemProps) {
  const [localExercises, setLocalExercises] = useState<WorkoutExerciseData[]>(
    (day.exercises ?? []).slice().sort((a, b) => a.orderInWorkout - b.orderInWorkout)
  )

  const handleAdd = async (dayId: number, form: {
    exerciseId: number
    sets: number
    reps: number
    weight?: number
    restSeconds?: number
    orderInWorkout: number
    notes: string
  }) => {
    const created = await onAddExercise(dayId, form)
    if (created) {
      setLocalExercises((prev) =>
        [...prev, created].sort((a, b) => a.orderInWorkout - b.orderInWorkout)
      )
      return true
    }
    return false
  }

  const handleRemove = async (workoutExerciseId: number) => {
    const success = await onRemoveExercise(workoutExerciseId)
    if (success) {
      setLocalExercises((prev) => prev.filter((e) => e.id !== workoutExerciseId))
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {day.dayNumber}
            </div>
            <div>
              <p className="font-semibold leading-tight">{day.dayName}</p>
              <p className="text-xs text-muted-foreground">
                {localExercises.length} ejercicio{localExercises.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {!isReadOnly && (
            <AddExerciseDialog
              dayId={day.id}
              nextOrder={localExercises.length + 1}
              exercises={exercises}
              isLoading={isAddingExercise}
              onAdd={handleAdd}
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        {localExercises.length === 0 ? (
          <p className="py-3 text-center text-sm text-muted-foreground">
            Sin ejercicios. Agregá uno para empezar.
          </p>
        ) : (
          localExercises.map((exercise, idx) => (
            <div
              key={exercise.id}
              className="flex items-start gap-3 rounded-lg border bg-background px-3 py-2.5"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                {idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{exercise.exerciseName}</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <div className="flex items-center gap-1 rounded bg-muted px-2 py-0.5">
                    <RotateCcw className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">{exercise.sets}×{exercise.reps}</span>
                  </div>
                  {exercise.weight && exercise.weight > 0 && (
                    <div className="flex items-center gap-1 rounded bg-muted px-2 py-0.5">
                      <Dumbbell className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{exercise.weight}kg</span>
                    </div>
                  )}
                  {exercise.restSeconds && exercise.restSeconds > 0 && (
                    <div className="flex items-center gap-1 rounded bg-muted px-2 py-0.5">
                      <Timer className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{exercise.restSeconds}s</span>
                    </div>
                  )}
                </div>
                {exercise.notes && (
                  <p className="mt-1 text-xs italic text-muted-foreground">{exercise.notes}</p>
                )}
              </div>

              {!isReadOnly && (
                <button
                  className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                  disabled={isRemovingExercise === `remove-exercise-${exercise.id}`}
                  onClick={() => handleRemove(exercise.id)}
                >
                  {isRemovingExercise === `remove-exercise-${exercise.id}` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}