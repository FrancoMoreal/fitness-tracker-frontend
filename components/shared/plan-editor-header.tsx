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

interface PlanEditorHeaderProps {
  name: string
  description?: string
  memberName?: string
  status: string
  memberId: number
  backLabel?: string
  isActivating: boolean
  canActivate: boolean
  onActivate: () => void
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  ACTIVE:    { label: "Activo",     className: "border-green-500/50 text-green-600 dark:text-green-400" },
  DRAFT:     { label: "Borrador",   className: "border-yellow-500/50 text-yellow-600 dark:text-yellow-400" },
  COMPLETED: { label: "Completado", className: "border-blue-500/50 text-blue-600 dark:text-blue-400" },
  CANCELLED: { label: "Cancelado",  className: "border-destructive/50 text-destructive" },
}

export function PlanEditorHeader({
  name,
  description,
  memberName,
  status,
  memberId,
  backLabel = "Volver al perfil",
  isActivating,
  canActivate,
  onActivate,
}: PlanEditorHeaderProps) {
  const statusConfig = STATUS_LABELS[status] ?? STATUS_LABELS.DRAFT
  const isDraft = status === "DRAFT"

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href={`/trainer/members/${memberId}`}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          {backLabel}
        </Link>
      </Button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold">{name}</h1>
            <Badge variant="outline" className={statusConfig.className}>
              {statusConfig.label}
            </Badge>
          </div>
          {memberName && (
            <p className="mt-1 text-sm text-muted-foreground">
              Para: <span className="font-medium">{memberName}</span>
            </p>
          )}
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {isDraft && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={isActivating || !canActivate}>
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
                  Al activar el plan,{" "}
                  <span className="font-semibold">{memberName}</span> podrá
                  verlo inmediatamente. Podrás seguir editándolo después.
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