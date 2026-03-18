import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { Calendar, User, ChevronRight, Dumbbell, Utensils } from "lucide-react"
import Link from "next/link"

export type PlanType = "workout" | "nutrition"

export interface PlanSummary {
  id: number
  name: string
  description?: string
  memberName?: string
  status: string
  startDate: string
  endDate?: string
  totalItems?: number  // totalDays para workout, totalMeals para nutrition
}

interface PlansListProps {
  type: PlanType
  plans: PlanSummary[]
}

const TYPE_CONFIG: Record<PlanType, {
  emptyTitle: string
  emptyDescription: string
  editBase: string
  itemLabel: string
  icon: React.ReactNode
}> = {
  workout: {
    emptyTitle:       "Sin planes de workout",
    emptyDescription: "Creá un plan desde el perfil de un miembro.",
    editBase:         "/trainer/routines",
    itemLabel:        "día",
    icon:             <Dumbbell className="h-8 w-8" />,
  },
  nutrition: {
    emptyTitle:       "Sin planes nutricionales",
    emptyDescription: "Creá un plan desde el perfil de un miembro.",
    editBase:         "/trainer/nutrition",
    itemLabel:        "comida",
    icon:             <Utensils className="h-8 w-8" />,
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

export function PlansList({ type, plans }: PlansListProps) {
  const config = TYPE_CONFIG[type]

  if (plans.length === 0) {
    return (
      <EmptyState
        icon={config.icon}
        title={config.emptyTitle}
        description={config.emptyDescription}
      />
    )
  }

  return (
    <div className="space-y-3">
      {plans.map((plan) => {
        const statusConfig = STATUS_LABELS[plan.status] ?? STATUS_LABELS.DRAFT
        return (
          <Card key={plan.id} className="transition-shadow hover:shadow-sm">
            <CardContent className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold leading-tight truncate">{plan.name}</p>
                  <Badge variant="outline" className={statusConfig.className}>
                    {statusConfig.label}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-3">
                  {plan.memberName && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <User className="h-3.5 w-3.5 shrink-0" />
                      <span>{plan.memberName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {formatDate(plan.startDate)}
                      {plan.endDate ? ` — ${formatDate(plan.endDate)}` : ""}
                    </span>
                  </div>
                  {plan.totalItems !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {plan.totalItems} {config.itemLabel}{plan.totalItems !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {plan.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">{plan.description}</p>
                )}
              </div>

              <Button asChild variant="outline" size="sm" className="shrink-0">
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
  )
}