"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, DollarSign, Users, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TrainerData } from "@/services/trainer.service"

interface TrainerCardProps {
  trainer: TrainerData
  /** ID de la solicitud pendiente si existe, null si no */
  pendingRequestId: number | null
  /** trainerId al que apunta la solicitud pendiente */
  pendingTrainerId: number | null
  isLoading: boolean
  onRequest: (trainerId: number) => void
  onCancel: (requestId: number) => void
}

export function TrainerCard({
  trainer,
  pendingRequestId,
  pendingTrainerId,
  isLoading,
  onRequest,
  onCancel,
}: TrainerCardProps) {
  const isThisPending = pendingTrainerId === trainer.id
  const hasPendingElsewhere = pendingRequestId !== null && !isThisPending

  return (
    <Card className={cn(
      "flex flex-col transition-all duration-200",
      isThisPending && "border-primary/50 bg-primary/5",
      hasPendingElsewhere && "opacity-60"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          {/* Avatar + nombre */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {(trainer.fullName ?? `${trainer.firstName} ${trainer.lastName}`)
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold leading-tight">
                {trainer.fullName ?? `${trainer.firstName} ${trainer.lastName}`}
              </p>
              {trainer.specialty && (
                <p className="mt-0.5 text-sm text-muted-foreground">{trainer.specialty}</p>
              )}
            </div>
          </div>

          {/* Badge estado */}
          {isThisPending && (
            <Badge variant="outline" className="border-primary/50 text-primary shrink-0">
              Solicitud enviada
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {/* Tarifa */}
        {trainer.hourlyRate !== undefined && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 shrink-0" />
            <span>${trainer.hourlyRate} / hora</span>
          </div>
        )}

        {/* Miembros asignados */}
        {trainer.assignedMembersCount !== undefined && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 shrink-0" />
            <span>
              {trainer.assignedMembersCount === 0
                ? "Sin miembros asignados"
                : `${trainer.assignedMembersCount} miembro${trainer.assignedMembersCount !== 1 ? "s" : ""}`}
            </span>
          </div>
        )}

        {/* Certificaciones */}
        {trainer.certifications && trainer.certifications.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {trainer.certifications.map((cert) => (
              <div key={cert} className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                <Award className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{cert}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3">
        {isThisPending ? (
          // Botón cancelar solicitud
          <Button
            variant="outline"
            className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
            disabled={isLoading}
            onClick={() => onCancel(pendingRequestId!)}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <X className="mr-2 h-4 w-4" />
            )}
            Cancelar solicitud
          </Button>
        ) : (
          // Botón solicitar
          <Button
            className="w-full"
            disabled={isLoading || hasPendingElsewhere}
            onClick={() => onRequest(trainer.id)}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Solicitar entrenador"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}