import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"
import { WorkoutDayAccordion } from "@/components/member/routines/workout-day-accordion"
import type { WorkoutPlanData } from "@/services/workout.service"

interface WorkoutPlanCardProps {
  plan: WorkoutPlanData
  memberId: number
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  ACTIVE:    { label: "Activo",     className: "border-green-500/50 text-green-600 dark:text-green-400" },
  DRAFT:     { label: "Borrador",   className: "border-yellow-500/50 text-yellow-600 dark:text-yellow-400" },
  COMPLETED: { label: "Completado", className: "border-blue-500/50 text-blue-600 dark:text-blue-400" },
  CANCELLED: { label: "Cancelado",  className: "border-destructive/50 text-destructive" },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric", month: "short", year: "numeric",
  })
}

export function WorkoutPlanCard({ plan, memberId }: WorkoutPlanCardProps) {
  const statusConfig = STATUS_LABELS[plan.status] ?? STATUS_LABELS.DRAFT
  const days = plan.workoutDays ?? []

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold leading-tight">{plan.name}</h3>
            {plan.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
            )}
          </div>
          <Badge variant="outline" className={statusConfig.className}>
            {statusConfig.label}
          </Badge>
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          {plan.trainerName && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span>{plan.trainerName}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {formatDate(plan.startDate)}
              {plan.endDate ? ` — ${formatDate(plan.endDate)}` : ""}
            </span>
          </div>
        </div>

        {plan.notes && (
          <p className="mt-2 rounded-md bg-muted/50 px-3 py-2 text-sm italic text-muted-foreground">
            {plan.notes}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        {days.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Este plan no tiene días cargados aún.
          </p>
        ) : (
          days
            .slice()
            .sort((a, b) => a.dayNumber - b.dayNumber)
            .map((day, idx) => (
              <WorkoutDayAccordion
                key={day.id}
                day={day}
                memberId={memberId}
                defaultOpen={idx === 0}
              />
            ))
        )}
      </CardContent>
    </Card>
  )
}