import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Loader2, Dumbbell, Layers } from "lucide-react"
import {
  CATEGORY_LABELS,
  MUSCLE_LABELS,
  DIFFICULTY_LABELS,
} from "@/types/exercise.types"
import type { ExerciseData } from "@/types/exercise.types"

interface ExerciseCardProps {
  exercise: ExerciseData
  isDeleting: boolean
  onDelete: (id: number) => void
}

const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER:     "border-green-500/50 text-green-600 dark:text-green-400",
  INTERMEDIATE: "border-yellow-500/50 text-yellow-600 dark:text-yellow-400",
  ADVANCED:     "border-red-500/50 text-red-600 dark:text-red-400",
}

export function ExerciseCard({ exercise, isDeleting, onDelete }: ExerciseCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold leading-tight truncate">{exercise.name}</p>
            {exercise.description && (
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                {exercise.description}
              </p>
            )}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar ejercicio?</AlertDialogTitle>
                <AlertDialogDescription>
                  Vas a eliminar{" "}
                  <span className="font-semibold">{exercise.name}</span>.
                  Si está siendo usado en algún plan activo, no podrá verse.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => onDelete(exercise.id)}
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        <div className="flex flex-wrap gap-2">
          {/* Categoría */}
          <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
            <Layers className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">{CATEGORY_LABELS[exercise.category] ?? exercise.category}</span>
          </div>

          {/* Músculo */}
          <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
            <Dumbbell className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">{MUSCLE_LABELS[exercise.primaryMuscle] ?? exercise.primaryMuscle}</span>
          </div>

          {/* Dificultad */}
          <Badge
            variant="outline"
            className={DIFFICULTY_COLORS[exercise.difficulty] ?? ""}
          >
            {DIFFICULTY_LABELS[exercise.difficulty] ?? exercise.difficulty}
          </Badge>

          {/* Equipamiento */}
          {exercise.equipment && (
            <span className="text-xs text-muted-foreground">{exercise.equipment}</span>
          )}
        </div>

        {/* Instrucciones */}
        {exercise.instructions && (
          <p className="text-xs text-muted-foreground line-clamp-2">{exercise.instructions}</p>
        )}
      </CardContent>
    </Card>
  )
}