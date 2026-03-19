import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getMyMemberProfile } from "@/services/member.service"
import { getMyTrainerProfile } from "@/services/trainer.service"
import { MemberProfileForm } from "@/components/profile/member-profile-form"
import { TrainerProfileForm } from "@/components/profile/trainer.profile-form"

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const { userType } = session

  if (userType === "MEMBER") {
    const member = await getMyMemberProfile()
    if (!member) redirect("/login")
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Mi perfil</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visualizá y editá tu información personal.
          </p>
        </div>
        <MemberProfileForm member={member} />
      </div>
    )
  }

  if (userType === "TRAINER") {
    const trainer = await getMyTrainerProfile()
    if (!trainer) redirect("/login")
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Mi perfil</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visualizá y editá tu información profesional.
          </p>
        </div>
        <TrainerProfileForm trainer={trainer} />
      </div>
    )
  }

redirect("/admin")
}