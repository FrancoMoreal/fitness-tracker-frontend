import { getAllUsers, getAllMembers, getAllTrainers, getAllCatalogExercises } from "@/services/admin.service"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Users, UserCheck, Dumbbell, Shield } from "lucide-react"

export default async function AdminPage() {
  const [users, members, trainers, exercises] = await Promise.all([
    getAllUsers(),
    getAllMembers(),
    getAllTrainers(),
    getAllCatalogExercises(),
  ])

  const stats = [
    { label: "Usuarios activos",  value: users.length,     icon: <Users className="h-5 w-5 text-primary" />      },
    { label: "Miembros activos",  value: members.length,   icon: <UserCheck className="h-5 w-5 text-green-600" /> },
    { label: "Trainers activos",  value: trainers.length,  icon: <Shield className="h-5 w-5 text-blue-600" />     },
    { label: "Ejercicios catálogo", value: exercises.length, icon: <Dumbbell className="h-5 w-5 text-orange-600" /> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Panel de administración</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen general del sistema.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}