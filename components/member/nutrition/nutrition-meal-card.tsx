import { Badge } from "@/components/ui/badge"
import { Flame, Beef, Wheat, Droplets, UtensilsCrossed } from "lucide-react"
import type { NutritionMealData, MealType } from "@/services/nutrition.service"

interface NutritionMealCardProps {
  meal: NutritionMealData
  index: number
}

const MEAL_TYPE_LABELS: Record<MealType, { label: string; className: string }> = {
  BREAKFAST:    { label: "Desayuno",       className: "border-orange-400/50 text-orange-600 dark:text-orange-400" },
  LUNCH:        { label: "Almuerzo",       className: "border-green-400/50 text-green-600 dark:text-green-400" },
  DINNER:       { label: "Cena",           className: "border-blue-400/50 text-blue-600 dark:text-blue-400" },
  SNACK:        { label: "Snack",          className: "border-yellow-400/50 text-yellow-600 dark:text-yellow-400" },
  PRE_WORKOUT:  { label: "Pre-entreno",    className: "border-purple-400/50 text-purple-600 dark:text-purple-400" },
  POST_WORKOUT: { label: "Post-entreno",   className: "border-pink-400/50 text-pink-600 dark:text-pink-400" },
}

export function NutritionMealCard({ meal, index }: NutritionMealCardProps) {
  const typeConfig = MEAL_TYPE_LABELS[meal.mealType] ?? MEAL_TYPE_LABELS.SNACK
  const hasMacros = meal.calories || meal.protein || meal.carbs || meal.fat

  return (
    <div className="flex items-start gap-3 rounded-lg border bg-background px-4 py-3">
      {/* Número de orden */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
        {index + 1}
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {/* Nombre + tipo */}
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium leading-tight">{meal.name}</p>
          <Badge variant="outline" className={typeConfig.className}>
            {typeConfig.label}
          </Badge>
        </div>

        {/* Alimentos */}
        {meal.foods && (
          <p className="rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            {meal.foods}
          </p>
        )}

        {/* Macros */}
        {hasMacros && (
          <div className="flex flex-wrap gap-2">
            {meal.calories !== undefined && (
              <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                <Flame className="h-3 w-3 text-orange-500" />
                <span className="text-xs font-medium">{meal.calories} kcal</span>
              </div>
            )}
            {meal.protein !== undefined && (
              <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                <Beef className="h-3 w-3 text-red-500" />
                <span className="text-xs font-medium">{meal.protein}g prot.</span>
              </div>
            )}
            {meal.carbs !== undefined && (
              <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                <Wheat className="h-3 w-3 text-yellow-500" />
                <span className="text-xs font-medium">{meal.carbs}g carbs</span>
              </div>
            )}
            {meal.fat !== undefined && (
              <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                <Droplets className="h-3 w-3 text-blue-500" />
                <span className="text-xs font-medium">{meal.fat}g grasas</span>
              </div>
            )}
          </div>
        )}

        {/* Notas */}
        {meal.notes && (
          <p className="text-xs italic text-muted-foreground">{meal.notes}</p>
        )}
      </div>
    </div>
  )
}