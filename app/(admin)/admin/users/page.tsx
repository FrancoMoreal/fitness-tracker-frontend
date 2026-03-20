import { getAllUsers } from "@/services/admin.service"
import { UsersClient } from "@/components/admin/users-client"

export default async function AdminUsersPage() {
  const users = await getAllUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Usuarios</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todos los usuarios activos del sistema.
        </p>
      </div>
      <UsersClient initialUsers={users} />
    </div>
  )
}