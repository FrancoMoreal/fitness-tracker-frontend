import { StatCard } from "@/components/dashboard/stat-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Dumbbell, Utensils, Bell, ChevronRight } from "lucide-react"
import Link from "next/link"
import type { TrainerDashboardStats } from "@/services/dashboard.service"
import type { TrainerData } from "@/services/trainer.service"

interface TrainerDashboardProps {
  trainer: TrainerData
  stats: TrainerDashboardStats
}

export function TrainerDashboard({ trainer, stats }: TrainerDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Saludo */}
      <div>
        <h1 className="text-2xl font-semibold">
          Bienvenido, {trainer.firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Acá tenés un resumen de tu actividad actual.
        </p>
      </div>

      {/* Alerta solicitudes pendientes */}
      {stats.pendingRequests > 0 && (
        <Card className="border-yellow-300 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20">
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/40">
                <Bell className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  {stats.pendingRequests} solicitud{stats.pendingRequests !== 1 ? "es" : ""} pendiente{stats.pendingRequests !== 1 ? "s" : ""}
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Nuevos miembros esperan tu respuesta.
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline" className="shrink-0 border-yellow-400">
              <Link href="/trainer/members">
                Ver solicitudes
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Miembros activos"
          value={stats.activeMembers}
          icon={<Users className="h-5 w-5 text-primary" />}
          href="/trainer/members"
          highlight={stats.activeMembers > 0}
        />
        <StatCard
          label="Solicitudes pendientes"
          value={stats.pendingRequests}
          icon={<Bell className="h-5 w-5 text-yellow-500" />}
          href="/trainer/members"
          highlight={stats.pendingRequests > 0}
        />
        <StatCard
          label="Planes de workout activos"
          value={stats.activeWorkoutPlans}
          icon={<Dumbbell className="h-5 w-5 text-blue-600" />}
          href="/trainer/routines"
        />
        <StatCard
          label="Planes nutricionales activos"
          value={stats.activeNutritionPlans}
          icon={<Utensils className="h-5 w-5 text-green-600" />}
          href="/trainer/nutrition"
        />
      </div>

      {/* Accesos rápidos */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Mis miembros",    href: "/trainer/members",   icon: <Users className="h-5 w-5 text-primary" />       },
          { label: "Rutinas",         href: "/trainer/routines",  icon: <Dumbbell className="h-5 w-5 text-blue-600" />   },
          { label: "Nutrición",       href: "/trainer/nutrition", icon: <Utensils className="h-5 w-5 text-green-600" />  },
          { label: "Mis ejercicios",  href: "/trainer/exercises", icon: <Dumbbell className="h-5 w-5 text-orange-500" /> },
        ].map((item) => (
          <Button key={item.href} asChild variant="outline" className="h-auto py-4">
            <Link href={item.href} className="flex flex-col items-center gap-2">
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}