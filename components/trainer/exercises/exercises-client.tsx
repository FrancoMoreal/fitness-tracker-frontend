"use client"

import { useExercises } from "@/hooks/use-exercises"
import { CreateExerciseDialog } from "@/components/trainer/exercises/create-exercise-dialog"
import { ExerciseCard } from "@/components/trainer/exercises/exercise-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Dumbbell } from "lucide-react"
import type { ExerciseData } from "@/types/exercise.types"

interface ExercisesClientProps {
  trainerId: number
  initialExercises: ExerciseData[]
}

export function ExercisesClient({ trainerId, initialExercises }: ExercisesClientProps) {
  const { exercises, loadingAction, handleCreate, handleDelete } = useExercises({
    trainerId,
    initialExercises,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Mis ejercicios</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ejercicios personalizados que creaste para usar en tus rutinas.
          </p>
        </div>
        <CreateExerciseDialog
          isLoading={loadingAction === "create"}
          onCreate={handleCreate}
        />
      </div>

      {/* Lista */}
      {exercises.length === 0 ? (
        <EmptyState
          icon={<Dumbbell className="h-8 w-8" />}
          title="Sin ejercicios custom"
          description="Creá tu primer ejercicio personalizado para usarlo en tus planes de workout."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isDeleting={loadingAction === `delete-${exercise.id}`}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}