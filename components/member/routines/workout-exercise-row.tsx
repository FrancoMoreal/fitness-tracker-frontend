import { Badge } from "@/components/ui/badge"
import { Dumbbell, Timer, RotateCcw } from "lucide-react"
import type { WorkoutExerciseData } from "@/services/workout.service"

interface WorkoutExerciseRowProps {
  exercise: WorkoutExerciseData
  index: number
}

export function WorkoutExerciseRow({ exercise, index }: WorkoutExerciseRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-background px-4 py-3">
      {/* Número de orden */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
        {index + 1}
      </div>

      {/* Nombre + detalles */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium leading-tight">{exercise.exerciseName}</p>
          {exercise.notes && (
            <span className="text-xs text-muted-foreground italic">
              {exercise.notes}
            </span>
          )}
        </div>

        {/* Métricas */}
        <div className="mt-2 flex flex-wrap gap-2">
          <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
            <RotateCcw className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-medium">
              {exercise.sets} series × {exercise.reps} reps
            </span>
          </div>

          {exercise.weight !== undefined && exercise.weight > 0 && (
            <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
              <Dumbbell className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium">{exercise.weight} kg</span>
            </div>
          )}

          {exercise.restSeconds !== undefined && exercise.restSeconds > 0 && (
            <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
              <Timer className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium">
                {exercise.restSeconds >= 60
                  ? `${Math.floor(exercise.restSeconds / 60)}m descanso`
                  : `${exercise.restSeconds}s descanso`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}