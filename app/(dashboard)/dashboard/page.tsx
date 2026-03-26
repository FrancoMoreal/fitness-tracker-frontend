import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getMyMemberProfile } from "@/services/member.service"
import { getMyTrainerProfile } from "@/services/trainer.service"
import { getMemberDashboardStats, getTrainerDashboardStats } from "@/services/dashboard.service"
import { MemberDashboard } from "@/components/dashboard/member-dashboard"
import { TrainerDashboard } from "@/components/dashboard/trainer-dashboard"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const { userType } = session

  if (userType === "MEMBER") {
    const member = await getMyMemberProfile()
    if (!member) redirect("/login")
    const stats = await getMemberDashboardStats(member.id)
    return <MemberDashboard member={member} stats={stats} />
  }

  if (userType === "TRAINER") {
    const trainer = await getMyTrainerProfile()
    if (!trainer) redirect("/login")
    const stats = await getTrainerDashboardStats(trainer.id)
    return <TrainerDashboard trainer={trainer} stats={stats} />
  }

  redirect("/login")
}