import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Calendar, CreditCard, Clock } from "lucide-react"
import type { MemberData } from "@/services/member.service"

interface MemberInfoCardProps {
  member: MemberData
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function getMembershipStatus(member: MemberData) {
  if (!member.membershipEndDate) return null
  const today = new Date()
  const endDate = new Date(member.membershipEndDate)
  const isExpired = endDate < today

  if (isExpired) {
    return { label: "Vencida", className: "border-destructive/50 text-destructive" }
  }
  if (member.remainingDays !== undefined && member.remainingDays <= 7) {
    return { label: `Vence en ${member.remainingDays} días`, className: "border-yellow-500/50 text-yellow-600 dark:text-yellow-400" }
  }
  return { label: "Al día", className: "border-green-500/50 text-green-600 dark:text-green-400" }
}

export function MemberInfoCard({ member }: MemberInfoCardProps) {
  const fullName = member.fullName ?? `${member.firstName} ${member.lastName}`
  const initials = fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  const membershipStatus = getMembershipStatus(member)

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{fullName}</h2>
            {member.email && (
              <p className="mt-0.5 text-sm text-muted-foreground">{member.email}</p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Teléfono */}
        {member.phone && (
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
            <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Teléfono</p>
              <p className="font-medium">{member.phone}</p>
            </div>
          </div>
        )}

        {member.dateOfBirth && (
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
            <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Fecha de nacimiento</p>
              <p className="font-medium">{formatDate(member.dateOfBirth)}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
          <CreditCard className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Membresía</p>
            <div className="mt-0.5 flex items-center gap-2 flex-wrap">
              <p className="font-medium">
                {formatDate(member.membershipStartDate)} — {formatDate(member.membershipEndDate)}
              </p>
              {membershipStatus && (
                <Badge variant="outline" className={membershipStatus.className}>
                  {membershipStatus.label}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {member.remainingDays !== undefined && member.remainingDays > 0 && (
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Días restantes</p>
              <p className="font-medium">{member.remainingDays} días</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}