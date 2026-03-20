import { getAllTrainers } from "@/services/admin.service"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Shield, Users } from "lucide-react"

export default async function AdminTrainersPage() {
  const trainers = await getAllTrainers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Trainers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todos los entrenadores activos del sistema.
        </p>
      </div>

      {trainers.length === 0 ? (
        <EmptyState icon={<Shield className="h-8 w-8" />} title="Sin trainers" />
      ) : (
        <div className="space-y-2">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3"
            >
              <div className="flex-1 min-w-0 space-y-0.5">
                <p className="font-medium leading-tight">
                  {trainer.fullName ?? `${trainer.firstName} ${trainer.lastName}`}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {trainer.specialty && <span>{trainer.specialty}</span>}
                  {trainer.hourlyRate && <span>· ${trainer.hourlyRate}/h</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {trainer.assignedMembersCount !== undefined && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{trainer.assignedMembersCount}</span>
                  </div>
                )}
                <Badge
                  variant="outline"
                  className={trainer.isActive
                    ? "border-green-500/50 text-green-600"
                    : "border-destructive/50 text-destructive"
                  }
                >
                  {trainer.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}