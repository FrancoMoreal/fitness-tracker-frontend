import { getAllMembers } from "@/services/admin.service"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { UserCheck } from "lucide-react"

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  NO_TRAINER: { label: "Sin trainer",  className: "border-muted-foreground/50 text-muted-foreground" },
  PENDING:    { label: "Pendiente",    className: "border-yellow-500/50 text-yellow-600" },
  ACTIVE:     { label: "Con trainer",  className: "border-green-500/50 text-green-600" },
  REJECTED:   { label: "Rechazado",   className: "border-destructive/50 text-destructive" },
  CANCELLED:  { label: "Cancelado",   className: "border-destructive/50 text-destructive" },
}

export default async function AdminMembersPage() {
  const members = await getAllMembers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Miembros</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todos los miembros activos del gimnasio.
        </p>
      </div>

      {members.length === 0 ? (
        <EmptyState icon={<UserCheck className="h-8 w-8" />} title="Sin miembros" />
      ) : (
        <div className="space-y-2">
          {members.map((member) => {
            const status = STATUS_LABELS[member.assignmentStatus] ?? STATUS_LABELS.NO_TRAINER
            return (
              <div
                key={member.id}
                className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3"
              >
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="font-medium leading-tight">
                    {member.fullName ?? `${member.firstName} ${member.lastName}`}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {member.email && <span>{member.email}</span>}
                    {member.phone && <span>· {member.phone}</span>}
                  </div>
                </div>
                <Badge variant="outline" className={status.className}>
                  {status.label}
                </Badge>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}