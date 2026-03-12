"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Award, DollarSign, Users, UserMinus, Loader2 } from "lucide-react"
import { api } from "@/lib/api-client"
import type { TrainerData } from "@/services/trainer.service"

interface MyTrainerCardProps {
  trainer: TrainerData
  memberId: number
}

export function MyTrainerCard({ trainer, memberId }: MyTrainerCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemoveTrainer = async () => {
    setIsRemoving(true)
    try {
      const response = await api.delete(
        `/api/trainer-assignments/members/${memberId}/remove-trainer`
      )

      if (!response.success) {
        toast.error("Error al remover entrenador", {
          description: response.error ?? "Intenta de nuevo.",
        })
        return
      }

      toast.success("Entrenador removido", {
        description: "Ya no tenés un entrenador asignado.",
      })

      // Refrescar para actualizar sidebar y redirigir al dashboard
      startTransition(() => {
        router.push("/dashboard")
        router.refresh()
      })
    } catch {
      toast.error("Error de conexión", { description: "Intenta de nuevo." })
    } finally {
      setIsRemoving(false)
    }
  }

  const fullName = trainer.fullName ?? `${trainer.firstName} ${trainer.lastName}`
  const initials = fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
            {initials}
          </div>

          {/* Nombre + especialidad */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{fullName}</h2>
              <Badge variant="outline" className="border-green-500/50 text-green-600 dark:text-green-400">
                Activo
              </Badge>
            </div>
            {trainer.specialty && (
              <p className="mt-0.5 text-sm text-muted-foreground">{trainer.specialty}</p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tarifa */}
        {trainer.hourlyRate !== undefined && (
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
            <DollarSign className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Tarifa horaria</p>
              <p className="font-medium">${trainer.hourlyRate} / hora</p>
            </div>
          </div>
        )}

        {/* Miembros asignados */}
        {trainer.assignedMembersCount !== undefined && (
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
            <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Miembros a cargo</p>
              <p className="font-medium">
                {trainer.assignedMembersCount === 0
                  ? "Sin otros miembros"
                  : `${trainer.assignedMembersCount} miembro${trainer.assignedMembersCount !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        )}

        {/* Certificaciones */}
        {trainer.certifications && trainer.certifications.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Certificaciones
            </p>
            <div className="flex flex-wrap gap-2">
              {trainer.certifications.map((cert) => (
                <div
                  key={cert}
                  className="flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5"
                >
                  <Award className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
              disabled={isPending || isRemoving}
            >
              {isRemoving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserMinus className="mr-2 h-4 w-4" />
              )}
              Remover entrenador
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Remover entrenador?</AlertDialogTitle>
              <AlertDialogDescription>
                Vas a desvincular a{" "}
                <span className="font-semibold text-foreground">{fullName}</span> como tu
                entrenador. Perderás acceso a las rutinas y planes que te asignó. Esta
                acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleRemoveTrainer}
              >
                Sí, remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}