"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import type { AssignmentRequest } from "@/services/assignment.service"

interface UseTrainerRequestsProps {
  trainerId: number
  initialRequests: AssignmentRequest[]
}

export function useTrainerRequests({ trainerId, initialRequests }: UseTrainerRequestsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [requests, setRequests] = useState<AssignmentRequest[]>(initialRequests)
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const handleAccept = async (requestId: number) => {
    setLoadingId(requestId)
    try {
      const response = await api.post(
        `/api/trainer-assignments/${requestId}/accept?trainerId=${trainerId}`,
        { response: "" }
      )

      if (!response.success) {
        toast.error("Error al aceptar solicitud", {
          description: response.error ?? "Intenta de nuevo.",
        })
        return
      }

      setRequests((prev) => prev.filter((r) => r.id !== requestId))
      toast.success("Solicitud aceptada", {
        description: "El miembro fue agregado a tu lista.",
      })
      startTransition(() => router.refresh())
    } catch {
      toast.error("Error de conexión", { description: "Intenta de nuevo." })
    } finally {
      setLoadingId(null)
    }
  }

  const handleReject = async (requestId: number) => {
    setLoadingId(requestId)
    try {
      const response = await api.post(
        `/api/trainer-assignments/${requestId}/reject?trainerId=${trainerId}`,
        { response: "" }
      )

      if (!response.success) {
        toast.error("Error al rechazar solicitud", {
          description: response.error ?? "Intenta de nuevo.",
        })
        return
      }

      setRequests((prev) => prev.filter((r) => r.id !== requestId))
      toast.success("Solicitud rechazada")
      startTransition(() => router.refresh())
    } catch {
      toast.error("Error de conexión", { description: "Intenta de nuevo." })
    } finally {
      setLoadingId(null)
    }
  }

  return {
    requests,
    loadingId,
    isPending,
    handleAccept,
    handleReject,
  }
}