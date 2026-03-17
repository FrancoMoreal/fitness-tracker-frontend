"use client"

import { useTrainerRequests } from "@/hooks/use-trainer-requests"
import { PendingRequestCard } from "@/components/trainer/pending-request-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Inbox } from "lucide-react"
import type { AssignmentRequest } from "@/services/assignment.service"

interface PendingRequestsSectionProps {
  trainerId: number
  initialRequests: AssignmentRequest[]
}

export function PendingRequestsSection({
  trainerId,
  initialRequests,
}: PendingRequestsSectionProps) {
  const { requests, loadingId, handleAccept, handleReject } = useTrainerRequests({
    trainerId,
    initialRequests,
  })

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="h-6 w-6" />}
        title="Sin solicitudes pendientes"
        description="Cuando un miembro te solicite como entrenador, aparecerá aquí."
      />
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <PendingRequestCard
          key={request.id}
          request={request}
          isLoading={loadingId === request.id}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      ))}
    </div>
  )
}