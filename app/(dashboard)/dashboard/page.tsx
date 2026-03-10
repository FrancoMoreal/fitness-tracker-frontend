import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getMyMemberProfile } from "@/services/member.service"

/**
 * Dashboard dispatcher — nunca renderiza contenido propio.
 * Lee el userType del JWT y redirige al área correcta.
 *
 * TRAINER  → /trainer/members
 * MEMBER   → /member/routines     (si tiene trainer ACTIVE)
 *          → /member/trainers     (si NO tiene trainer)
 */
export default async function DashboardPage() {
  const session = await getSession()

  // El layout ya redirige si no hay sesión, pero lo dejamos como
  // segunda línea de defensa por si se accede directamente
  if (!session) {
    redirect("/login")
  }

  if (session.userType === "TRAINER") {
    redirect("/trainer/members")
  }

  if (session.userType === "MEMBER") {
    // Consultamos el perfil del member para ver su assignmentStatus
    const member = await getMyMemberProfile()

    // Si el fetch falla o el member no existe, mandamos a la lista de trainers
    if (!member) {
      redirect("/member/trainers")
    }

    const hasActiveTrainer = member.assignmentStatus === "ACTIVE"
    redirect(hasActiveTrainer ? "/member/routines" : "/member/trainers")
  }

  // Fallback por si el userType es inesperado
  redirect("/login")
}