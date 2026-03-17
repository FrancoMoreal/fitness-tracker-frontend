import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import type { MemberData } from "@/services/member.service"

interface ActiveMemberCardProps {
  member: MemberData
}

export function ActiveMemberCard({ member }: ActiveMemberCardProps) {
  const fullName = `${member.firstName} ${member.lastName}`
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium leading-tight">{fullName}</p>
            {member.email && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{member.email}</p>
            )}
          </div>
          <Badge
            variant="outline"
            className="shrink-0 border-green-500/50 text-green-600 dark:text-green-400"
          >
            Activo
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="grid grid-cols-2 gap-2">
          {member.phone && (
            <div className="rounded-md bg-muted/50 px-3 py-2">
              <p className="text-xs text-muted-foreground">Teléfono</p>
              <p className="text-sm font-medium">{member.phone}</p>
            </div>
          )}
          {member.membershipEndDate && (
            <div className="rounded-md bg-muted/50 px-3 py-2">
              <p className="text-xs text-muted-foreground">Membresía</p>
              <p className="text-sm font-medium">
                {new Date(member.membershipEndDate).toLocaleDateString("es-AR")}
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t pt-3">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/trainer/members/${member.id}`}>
            Ver perfil
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}