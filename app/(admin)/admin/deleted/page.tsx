import { getDeletedUsers } from "@/services/admin.service"
import { DeletedUsersClient } from "@/components/admin/deleted-users-client"

export default async function AdminDeletedPage() {
  const users = await getDeletedUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Usuarios eliminados</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Usuarios con soft delete. Podés restaurarlos en cualquier momento.
        </p>
      </div>
      <DeletedUsersClient initialUsers={users} />
    </div>
  )
}