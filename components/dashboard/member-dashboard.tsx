import { StatCard } from "@/components/dashboard/stat-card"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Utensils, Trophy, Calendar, ChevronRight, Star } from "lucide-react"
import Link from "next/link"
import type { MemberDashboardStats } from "@/services/dashboard.service"
import type { MemberData } from "@/services/member.service"

interface MemberDashboardProps {
  member: MemberData
  stats: MemberDashboardStats
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  })
}

function RatingStars({ rating }: { rating?: number }) {
  if (!rating) return null
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3 w-3",
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  )
}

// cn imported inline
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export function MemberDashboard({ member, stats }: MemberDashboardProps) {
  const fullName = member.fullName ?? `${member.firstName} ${member.lastName}`
  const hasTrainer = member.assignmentStatus === "ACTIVE"

  return (
    <div className="space-y-6">
      {/* Saludo */}
      <div>
        <h1 className="text-2xl font-semibold">
          Bienvenido, {member.firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasTrainer
            ? "Revisá tu progreso y tus planes activos."
            : "Buscá un entrenador para comenzar tu rutina."}
        </p>
      </div>

      {/* CTA sin trainer */}
      {!hasTrainer && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="font-medium">¿Todavía no tenés entrenador?</p>
              <p className="text-sm text-muted-foreground">
                Explorá los trainers disponibles y comenzá tu camino.
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="/member/trainers">Buscar entrenador</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Workouts completados"
          value={stats.completedWorkouts}
          icon={<Trophy className="h-5 w-5 text-yellow-500" />}
          highlight={stats.completedWorkouts > 0}
        />
        <StatCard
          label="Rutinas activas"
          value={stats.activeWorkoutPlans}
          icon={<Dumbbell className="h-5 w-5 text-primary" />}
          href={stats.activeWorkoutPlans > 0 ? "/member/routines" : undefined}
        />
        <StatCard
          label="Planes de nutrición"
          value={stats.activeNutritionPlans}
          icon={<Utensils className="h-5 w-5 text-green-600" />}
          href={stats.activeNutritionPlans > 0 ? "/member/nutrition" : undefined}
        />
      </div>

      {/* Historial reciente */}
      {stats.recentHistory.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Workouts recientes</h2>
              <Button asChild variant="ghost" size="sm" className="-mr-2">
                <Link href="/member/routines">
                  Ver todos
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {stats.recentHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Dumbbell className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight">{item.workoutDayName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(item.completedAt)}</span>
                      </div>
                      <RatingStars rating={item.rating} />
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="border-green-500/50 text-green-600 shrink-0">
                  Completado
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Accesos rápidos */}
      {hasTrainer && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Button asChild variant="outline" className="h-auto py-4">
            <Link href="/member/routines" className="flex flex-col items-center gap-2">
              <Dumbbell className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Ver mis rutinas</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4">
            <Link href="/member/nutrition" className="flex flex-col items-center gap-2">
              <Utensils className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">Ver mi nutrición</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}