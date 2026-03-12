import { getAllTrainers } from "@/services/trainer.service"
import { getMyMemberProfile } from "@/services/member.service"
import { TrainerList } from "@/components/member/trainer-list"
import type { AssignmentRequest } from "@/services/assignment.service"
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

/**
 * Obtiene la solicitud pendiente del member server-side.
 * Busca entre todas sus solicitudes la que tenga status PENDING.
 */
async function getPendingRequest(memberId: number): Promise<AssignmentRequest | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("fitness_tracker_token")?.value

    const response = await fetch(
      `${API_URL}/api/trainer-assignments/members/${memberId}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      }
    )

    if (!response.ok) return null

    const requests = (await response.json()) as AssignmentRequest[]
    return requests.find((r) => r.status === "PENDING") ?? null
  } catch {
    return null
  }
}

export default async function MemberTrainersPage() {
  // Fetch en paralelo para minimizar tiempo de carga
  const [trainers, member] = await Promise.all([
    getAllTrainers(),
    getMyMemberProfile(),
  ])

  const pendingRequest = member ? await getPendingRequest(member.id) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Entrenadores</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Explorá los entrenadores disponibles y enviá una solicitud para comenzar.
        </p>
      </div>

      {/* Banner solicitud pendiente */}
      {pendingRequest && (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-200">
          <span className="font-medium">Solicitud pendiente</span>
          <span className="text-yellow-700 dark:text-yellow-300">
            Enviaste una solicitud a{" "}
            <span className="font-semibold">{pendingRequest.trainerName}</span>.
            Podés cancelarla si cambiás de opinión.
          </span>
        </div>
      )}

      {/* Lista de trainers */}
      <TrainerList
        trainers={trainers}
        memberId={member?.id ?? 0}
        pendingRequest={pendingRequest}
      />
    </div>
  )
}