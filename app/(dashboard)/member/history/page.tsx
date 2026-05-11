import { getMyMemberProfile } from "@/services/member.service"
import { getWorkoutHistory } from "@/services/history.service"
import { WorkoutHistoryCard } from "@/components/member/history/workout-history-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Trophy } from "lucide-react"

export default async function MemberHistoryPage() {
  const member = await getMyMemberProfile()
  const history = member ? await getWorkoutHistory(member.id) : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Historial de workouts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todos tus entrenamientos completados.{" "}
          {history.length > 0 && (
            <span className="font-medium text-foreground">
              {history.length} workout{history.length !== 1 ? "s" : ""} en total.
            </span>
          )}
        </p>
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon={<Trophy className="h-8 w-8" />}
          title="Sin workouts completados"
          description="Completá tu primer entrenamiento desde la sección de rutinas."
        />
      ) : (
        <div className="space-y-3">
          {history.map((completion) => (
            <WorkoutHistoryCard key={completion.id} completion={completion} />
          ))}
        </div>
      )}
    </div>
  )
}