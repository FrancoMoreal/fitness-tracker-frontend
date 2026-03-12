import { api } from "@/lib/api-client"

export type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED"

export interface AssignmentRequest {
  id: number
  externalId: string
  memberId: number
  memberName: string
  trainerId: number
  trainerName: string
  status: RequestStatus
  requestedAt: string
  respondedAt?: string
  memberMessage?: string
  trainerResponse?: string
}

export async function getMemberRequests(memberId: number) {
  return api.get<AssignmentRequest[]>(`/api/trainer-assignments/members/${memberId}`)
}

export async function requestTrainer(memberId: number, trainerId: number, message?: string) {
  return api.post<AssignmentRequest>(
    `/api/trainer-assignments/request?memberId=${memberId}`,
    { trainerId, message: message ?? "" }
  )
}

export async function cancelRequest(requestId: number, memberId: number) {
  return api.delete<void>(
    `/api/trainer-assignments/${requestId}/cancel?memberId=${memberId}`
  )
}