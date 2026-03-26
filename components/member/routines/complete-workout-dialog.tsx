"use client"

import { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Loader2, Star } from "lucide-react"
import { useCompleteWorkout } from "@/hooks/use-complete-workout"
import type { WorkoutExerciseData } from "@/services/workout.service"
import { cn } from "@/lib/utils"

interface CompleteWorkoutDialogProps {
  memberId: number
  dayId: number
  dayName: string
  exercises: WorkoutExerciseData[]
}

export function CompleteWorkoutDialog({
  memberId, dayId, dayName, exercises,
}: CompleteWorkoutDialogProps) {
  const [open, setOpen] = useState(false)

  const {
    rating, setRating,
    notes, setNotes,
    exerciseLogs, updateLog,
    isSubmitting,
    handleSubmit,
  } = useCompleteWorkout({ memberId, dayId, exercises })

  const onSubmit = async () => {
    const success = await handleSubmit()
    if (success) setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!isSubmitting) setOpen(v) }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <CheckCircle className="h-4 w-4" />
          Completar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Completar: {dayName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Rating */}
          <div className="space-y-2">
            <Label>¿Cómo fue el entrenamiento?</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-7 w-7 transition-colors",
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {["", "Muy difícil", "Difícil", "Normal", "Bien", "Excelente"][rating]}
              </span>
            </div>
          </div>

          {/* Logs por ejercicio */}
          {exerciseLogs.length > 0 && (
            <div className="space-y-3">
              <Label>Resultados por ejercicio</Label>
              {exerciseLogs.map((log, idx) => (
                <div key={log.workoutExerciseId} className="rounded-lg border bg-muted/30 p-3 space-y-2">
                  <p className="text-sm font-medium">{log.exerciseName}</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Series</Label>
                      <Input
                        type="number" min={1}
                        value={log.setsCompleted}
                        onChange={(e) => updateLog(idx, "setsCompleted", e.target.value)}
                        disabled={isSubmitting}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Reps</Label>
                      <Input
                        type="number" min={1}
                        value={log.repsCompleted}
                        onChange={(e) => updateLog(idx, "repsCompleted", e.target.value)}
                        disabled={isSubmitting}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Peso (kg)</Label>
                      <Input
                        type="number" min={0} step="0.5" placeholder="Opcional"
                        value={log.weightUsed}
                        onChange={(e) => updateLog(idx, "weightUsed", e.target.value)}
                        disabled={isSubmitting}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notas generales */}
          <div className="space-y-1.5">
            <Label htmlFor="completion-notes">Notas (opcional)</Label>
            <Textarea
              id="completion-notes"
              placeholder="¿Cómo te sentiste? ¿Algo a mejorar?"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" disabled={isSubmitting} onClick={onSubmit}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrar workout
            </Button>
            <Button variant="outline" disabled={isSubmitting} onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}