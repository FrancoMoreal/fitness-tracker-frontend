"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { TrainerCard } from "@/components/member/trainer-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Users } from "lucide-react"
import {
  requestTrainer,
  cancelRequest,
  type AssignmentRequest,
} from "@/services/assignment.service"
import type { TrainerData } from "@/services/trainer.service"

interface TrainerListProps {
  trainers: TrainerData[]
  memberId: number
  /** Solicitud pendiente actual, null si no existe */
  pendingRequest: AssignmentRequest | null
}

export function TrainerList({ trainers, memberId, pendingRequest }: TrainerListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeLoadingId, setActiveLoadingId] = useState<number | null>(null)

  // Estado local de la solicitud pendiente para actualizar la UI sin esperar revalidación
  const [currentPending, setCurrentPending] = useState<AssignmentRequest | null>(pendingRequest)

  const handleRequest = async (trainerId: number) => {
    setActiveLoadingId(trainerId)
    try {
      const response = await requestTrainer(memberId, trainerId)
      if (!response.success) {
        toast.error("Error al enviar solicitud", {
          description: response.error ?? "Intenta de nuevo.",
        })
        return
      }

      setCurrentPending(response.data ?? null)
      toast.success("Solicitud enviada", {
        description: "El entrenador recibirá tu solicitud y podrá aceptarla o rechazarla.",
      })

      // Revalidar el sidebar para que "Mi entrenador" aparezca si corresponde
      startTransition(() => router.refresh())
    } catch {
      toast.error("Error de conexión", { description: "Intenta de nuevo." })
    } finally {
      setActiveLoadingId(null)
    }
  }

  const handleCancel = async (requestId: number) => {
    setActiveLoadingId(requestId)
    try {
      const response = await cancelRequest(requestId, memberId)
      if (!response.success) {
        toast.error("Error al cancelar", {
          description: response.error ?? "Intenta de nuevo.",
        })
        return
      }

      setCurrentPending(null)
      toast.success("Solicitud cancelada")
      startTransition(() => router.refresh())
    } catch {
      toast.error("Error de conexión", { description: "Intenta de nuevo." })
    } finally {
      setActiveLoadingId(null)
    }
  }

  if (trainers.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-8 w-8" />}
        title="No hay entrenadores disponibles"
        description="No encontramos entrenadores activos en este momento. Volvé a intentar más tarde."
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trainers.map((trainer) => (
        <TrainerCard
          key={trainer.id}
          trainer={trainer}
          pendingRequestId={currentPending?.id ?? null}
          pendingTrainerId={currentPending?.trainerId ?? null}
          isLoading={isPending || activeLoadingId === trainer.id || activeLoadingId === currentPending?.id}
          onRequest={handleRequest}
          onCancel={handleCancel}
        />
      ))}
    </div>
  )
}