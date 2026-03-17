import { ActiveMemberCard } from "@/components/trainer/active-member-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Users } from "lucide-react"
import type { MemberData } from "@/services/member.service"

interface ActiveMembersSectionProps {
  members: MemberData[]
}

export function ActiveMembersSection({ members }: ActiveMembersSectionProps) {
  if (members.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title="Sin miembros asignados"
        description="Cuando aceptes una solicitud, el miembro aparecerá aquí."
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <ActiveMemberCard key={member.id} member={member} />
      ))}
    </div>
  )
}