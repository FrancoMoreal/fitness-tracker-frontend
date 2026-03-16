import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Flame, Beef, Wheat, Droplets } from "lucide-react"
import { NutritionMealCard } from "@/components/member/nutrition/nutrition-meal-card"
import type { NutritionPlanData } from "@/services/nutrition.service"

interface NutritionPlanCardProps {
  plan: NutritionPlanData
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

function calculateTotals(meals: NutritionPlanData["meals"]) {
  if (!meals || meals.length === 0) return null

  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories ?? 0),
      protein:  acc.protein  + (meal.protein  ?? 0),
      carbs:    acc.carbs    + (meal.carbs     ?? 0),
      fat:      acc.fat      + (meal.fat       ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  // Solo mostrar totales si al menos una comida tiene macros
  const hasMacros = meals.some(
    (m) => m.calories || m.protein || m.carbs || m.fat
  )
  return hasMacros ? totals : null
}

export function NutritionPlanCard({ plan }: NutritionPlanCardProps) {
  const statusConfig = STATUS_LABELS[plan.status] ?? STATUS_LABELS.DRAFT
  const meals = (plan.meals ?? []).slice().sort((a, b) => a.orderInPlan - b.orderInPlan)
  const totals = calculateTotals(meals)

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold leading-tight">{plan.name}</h3>
            {plan.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {plan.description}
              </p>
            )}
          </div>
          <Badge variant="outline" className={statusConfig.className}>
            {statusConfig.label}
          </Badge>
        </div>

        {/* Metadata */}
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

        {/* Totales diarios */}
        {totals && (
          <div className="mt-3 rounded-lg border bg-muted/30 p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total diario estimado
            </p>
            <div className="flex flex-wrap gap-3">
              {totals.calories > 0 && (
                <div className="flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  <span className="text-sm font-semibold">{Math.round(totals.calories)}</span>
                  <span className="text-xs text-muted-foreground">kcal</span>
                </div>
              )}
              {totals.protein > 0 && (
                <div className="flex items-center gap-1.5">
                  <Beef className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-sm font-semibold">{Math.round(totals.protein)}g</span>
                  <span className="text-xs text-muted-foreground">prot.</span>
                </div>
              )}
              {totals.carbs > 0 && (
                <div className="flex items-center gap-1.5">
                  <Wheat className="h-3.5 w-3.5 text-yellow-500" />
                  <span className="text-sm font-semibold">{Math.round(totals.carbs)}g</span>
                  <span className="text-xs text-muted-foreground">carbs</span>
                </div>
              )}
              {totals.fat > 0 && (
                <div className="flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-sm font-semibold">{Math.round(totals.fat)}g</span>
                  <span className="text-xs text-muted-foreground">grasas</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        {meals.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Este plan no tiene comidas cargadas aún.
          </p>
        ) : (
          meals.map((meal, idx) => (
            <NutritionMealCard key={meal.id} meal={meal} index={idx} />
          ))
        )}
      </CardContent>
    </Card>
  )
}