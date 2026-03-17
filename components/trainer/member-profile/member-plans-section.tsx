import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreatePlanDialog } from "@/components/trainer/member-profile/create-plan-dialog"
import { ChevronRight, Calendar } from "lucide-react"
import Link from "next/link"

interface PlanSummary {
  id: number
  name: string
  status: string
  startDate: string
  endDate?: string
}

interface MemberPlansSectionProps {
  type: "workout" | "nutrition"
  plans: PlanSummary[]
  trainerId: number
  memberId: number
}

const TYPE_CONFIG = {
  workout: {
    title:       "Planes de workout",
    emptyText:   "Sin planes de workout asignados.",
    editBase:    "/trainer/routines",
  },
  nutrition: {
    title:       "Planes nutricionales",
    emptyText:   "Sin planes nutricionales asignados.",
    editBase:    "/trainer/nutrition",
  },
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  ACTIVE:    { label: "Activo",     className: "border-green-500/50 text-green-600 dark:text-green-400" },
  DRAFT:     { label: "Borrador",   className: "border-yellow-500/50 text-yellow-600 dark:text-yellow-400" },
  COMPLETED: { label: "Completado", className: "border-blue-500/50 text-blue-600 dark:text-blue-400" },
  CANCELLED: { label: "Cancelado",  className: "border-destructive/50 text-destructive" },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function MemberPlansSection({
  type,
  plans,
  trainerId,
  memberId,
}: MemberPlansSectionProps) {
  const config = TYPE_CONFIG[type]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">{config.title}</h2>
        <CreatePlanDialog
          type={type}
          trainerId={trainerId}
          memberId={memberId}
        />
      </div>

      {plans.length === 0 ? (
        <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
          {config.emptyText}
        </p>
      ) : (
        <div className="space-y-2">
          {plans.map((plan) => {
            const statusConfig = STATUS_LABELS[plan.status] ?? STATUS_LABELS.DRAFT
            return (
              <Card key={plan.id} className="transition-shadow hover:shadow-sm">
                <CardContent className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium leading-tight truncate">{plan.name}</p>
                      <Badge variant="outline" className={statusConfig.className}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDate(plan.startDate)}
                        {plan.endDate ? ` — ${formatDate(plan.endDate)}` : ""}
                      </span>
                    </div>
                  </div>
                  <Button asChild variant="ghost" size="sm" className="shrink-0">
                    <Link href={`${config.editBase}/${plan.id}`}>
                      Editar
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}