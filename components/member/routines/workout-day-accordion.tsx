"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ListChecks } from "lucide-react"
import { cn } from "@/lib/utils"
import { WorkoutExerciseRow } from "@/components/member/routines/workout-exercise-row"
import { CompleteWorkoutDialog } from "@/components/member/routines/complete-workout-dialog"
import type { WorkoutDayData } from "@/services/workout.service"

interface WorkoutDayAccordionProps {
  day: WorkoutDayData
  memberId: number
  defaultOpen?: boolean
}

export function WorkoutDayAccordion({ day, memberId, defaultOpen = false }: WorkoutDayAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const exercises = day.exercises ?? []

  return (
    <div className="overflow-hidden rounded-lg border">
      {/* Header del día */}
      <div className="flex items-center justify-between bg-muted/40 px-4 py-3">
        <button
          className="flex flex-1 items-center gap-3 text-left"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {day.dayNumber}
          </div>
          <div>
            <p className="font-medium leading-tight">{day.dayName}</p>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <ListChecks className="h-3 w-3" />
              <span>
                {exercises.length > 0
                  ? `${exercises.length} ejercicio${exercises.length !== 1 ? "s" : ""}`
                  : (day.totalExercises ?? 0) + " ejercicios"}
              </span>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {/* Botón completar — solo si hay ejercicios */}
          {exercises.length > 0 && (
            <CompleteWorkoutDialog
              memberId={memberId}
              dayId={day.id}
              dayName={day.dayName}
              exercises={exercises}
            />
          )}
          <button onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Contenido expandible */}
      <div className={cn(
        "grid transition-all duration-200",
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}>
        <div className="overflow-hidden">
          <div className="space-y-2 p-3">
            {day.notes && (
              <p className="rounded-md bg-muted/50 px-3 py-2 text-sm italic text-muted-foreground">
                {day.notes}
              </p>
            )}
            {exercises.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Sin ejercicios cargados.
              </p>
            ) : (
              exercises
                .slice()
                .sort((a, b) => a.orderInWorkout - b.orderInWorkout)
                .map((exercise, idx) => (
                  <WorkoutExerciseRow key={exercise.id} exercise={exercise} index={idx} />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}