import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, Star, Dumbbell } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WorkoutCompletionData } from "@/services/history.service"

interface WorkoutHistoryCardProps {
  completion: WorkoutCompletionData
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function RatingStars({ rating }: { rating?: number }) {
  if (!rating) return null
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"
          )}
        />
      ))}
    </div>
  )
}

export function WorkoutHistoryCard({ completion }: WorkoutHistoryCardProps) {
  const logs = completion.exerciseLogs ?? []

  return (
    <Card className="transition-shadow hover:shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold leading-tight">{completion.workoutDayName}</p>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(completion.completedAt)}</span>
                </div>
                <RatingStars rating={completion.rating} />
              </div>
            </div>
          </div>
          <Badge variant="outline" className="border-green-500/50 text-green-600 dark:text-green-400 shrink-0">
            Completado
          </Badge>
        </div>

        {completion.notes && (
          <p className="mt-2 rounded-md bg-muted/50 px-3 py-2 text-sm italic text-muted-foreground">
            {completion.notes}
          </p>
        )}
      </CardHeader>

      {logs.length > 0 && (
        <CardContent className="pt-0 space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Ejercicios realizados
          </p>
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-3 py-2"
            >
              <p className="text-sm font-medium truncate">{log.exerciseName}</p>
              <div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground">
                <span>{log.setsCompleted} × {log.repsCompleted}</span>
                {log.weightUsed && log.weightUsed > 0 && (
                  <span className="text-muted-foreground">· {log.weightUsed}kg</span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  )
}