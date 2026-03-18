"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Zap, ChevronLeft } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { WorkoutPlanData } from "@/services/workout.service"

interface WorkoutEditorHeaderProps {
  plan: WorkoutPlanData
  memberId: number
  isActivating: boolean
  onActivate: () => void
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  ACTIVE:    { label: "Activo",   className: "border-green-500/50 text-green-600 dark:text-green-400" },
  DRAFT:     { label: "Borrador", className: "border-yellow-500/50 text-yellow-600 dark:text-yellow-400" },
  COMPLETED: { label: "Completado", className: "border-blue-500/50 text-blue-600 dark:text-blue-400" },
  CANCELLED: { label: "Cancelado",  className: "border-destructive/50 text-destructive" },
}

export function WorkoutEditorHeader({
  plan,
  memberId,
  isActivating,
  onActivate,
}: WorkoutEditorHeaderProps) {
  const statusConfig = STATUS_LABELS[plan.status] ?? STATUS_LABELS.DRAFT
  const isDraft = plan.status === "DRAFT"
  const hasDays = (plan.workoutDays?.length ?? 0) > 0

  return (
    <div className="space-y-4">
      {/* Navegación */}
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href={`/trainer/members/${memberId}`}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Volver al perfil
        </Link>
      </Button>

      {/* Título + acciones */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold">{plan.name}</h1>
            <Badge variant="outline" className={statusConfig.className}>
              {statusConfig.label}
            </Badge>
          </div>
          {plan.memberName && (
            <p className="mt-1 text-sm text-muted-foreground">
              Para: <span className="font-medium">{plan.memberName}</span>
            </p>
          )}
          {plan.description && (
            <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
          )}
        </div>

        {isDraft && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={isActivating || !hasDays}>
                {isActivating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                Activar plan
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Activar plan?</AlertDialogTitle>
                <AlertDialogDescription>
                  Al activar el plan, <span className="font-semibold">{plan.memberName}</span> podrá
                  verlo en su sección de rutinas. Podrás seguir editándolo después.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onActivate}>Activar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}