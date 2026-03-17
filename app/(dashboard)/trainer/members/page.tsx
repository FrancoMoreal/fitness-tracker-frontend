import { redirect } from "next/navigation"
import { getMyTrainerProfile } from "@/services/trainer.service"
import { getMembersByTrainer } from "@/services/member.service"
import { PendingRequestsSection } from "@/components/trainer/pending-requests-section"
import { ActiveMembersSection } from "@/components/trainer/active-member-section"
import { cookies } from "next/headers"
import type { AssignmentRequest } from "@/services/assignment.service"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

async function getPendingRequests(trainerId: number): Promise<AssignmentRequest[]> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("fitness_tracker_token")?.value

    const response = await fetch(
      `${API_URL}/api/trainer-assignments/trainers/${trainerId}/pending`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      }
    )
    if (!response.ok) return []
    return (await response.json()) as AssignmentRequest[]
  } catch {
    return []
  }
}

export default async function TrainerMembersPage() {
  const trainer = await getMyTrainerProfile()

  if (!trainer) redirect("/login")

  const [pendingRequests, activeMembers] = await Promise.all([
    getPendingRequests(trainer.id),
    getMembersByTrainer(trainer.id),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Mis miembros</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestioná tus solicitudes pendientes y tus miembros activos.
        </p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">Solicitudes pendientes</h2>
          {pendingRequests.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-500 px-1.5 text-xs font-semibold text-white">
              {pendingRequests.length}
            </span>
          )}
        </div>
        <PendingRequestsSection
          trainerId={trainer.id}
          initialRequests={pendingRequests}
        />
      </section>

      <div className="border-t" />

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">Miembros activos</h2>
          {activeMembers.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
              {activeMembers.length}
            </span>
          )}
        </div>
        <ActiveMembersSection members={activeMembers} />
      </section>
    </div>
  )
}