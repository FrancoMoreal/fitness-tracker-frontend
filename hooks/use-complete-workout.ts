"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/lib/api-client"

interface ExerciseLogForm {
  workoutExerciseId: number
  exerciseName: string
  sets: number
  reps: number
  setsCompleted: string
  repsCompleted: string
  weightUsed: string
  notes: string
}

interface UseCompleteWorkoutProps {
  memberId: number
  dayId: number
  exercises: {
    id: number
    exerciseName: string
    sets: number
    reps: number
  }[]
}

export function useCompleteWorkout({ memberId, dayId, exercises }: UseCompleteWorkoutProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState<number>(5)
  const [notes, setNotes] = useState("")
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLogForm[]>(
    exercises.map((e) => ({
      workoutExerciseId: e.id,
      exerciseName:      e.exerciseName,
      sets:              e.sets,
      reps:              e.reps,
      setsCompleted:     String(e.sets),
      repsCompleted:     String(e.reps),
      weightUsed:        "",
      notes:             "",
    }))
  )

  const updateLog = (idx: number, field: keyof ExerciseLogForm, value: string) => {
    setExerciseLogs((prev) =>
      prev.map((log, i) => (i === idx ? { ...log, [field]: value } : log))
    )
  }

  const handleSubmit = async (): Promise<boolean> => {
    setIsSubmitting(true)
    try {
      const response = await api.post(
        `/api/workout-plans/days/${dayId}/complete?memberId=${memberId}`,
        {
          rating,
          notes: notes.trim() || undefined,
          exerciseLogs: exerciseLogs.map((log) => ({
            workoutExerciseId: log.workoutExerciseId,
            setsCompleted:     Number(log.setsCompleted) || log.sets,
            repsCompleted:     Number(log.repsCompleted) || log.reps,
            weightUsed:        log.weightUsed ? Number(log.weightUsed) : undefined,
            notes:             log.notes.trim() || undefined,
          })),
        }
      )

      if (!response.success) {
        toast.error("Error al registrar workout", { description: response.error })
        return false
      }

      toast.success("¡Workout completado!", {
        description: "Tu progreso fue registrado correctamente.",
      })
      startTransition(() => router.refresh())
      return true
    } catch {
      toast.error("Error de conexión")
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    rating, setRating,
    notes, setNotes,
    exerciseLogs, updateLog,
    isSubmitting, isPending,
    handleSubmit,
  }
}