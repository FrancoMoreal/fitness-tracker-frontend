"use client"

import { useAdminUsers } from "@/hooks/use-admin-users"
import { AdminUserRow } from "@/components/admin/admin-user-row"
import { EmptyState } from "@/components/shared/empty-state"
import { UserX } from "lucide-react"
import type { UserData } from "@/services/admin.service"

interface DeletedUsersClientProps {
  initialUsers: UserData[]
}

export function DeletedUsersClient({ initialUsers }: DeletedUsersClientProps) {
  const { users, loadingAction, handleRestore } = useAdminUsers(initialUsers)

  return (
    <div className="space-y-3">
      {users.length === 0 ? (
        <EmptyState
          icon={<UserX className="h-8 w-8" />}
          title="Sin usuarios eliminados"
          description="No hay usuarios eliminados en el sistema."
        />
      ) : (
        users.map((user) => (
          <AdminUserRow
            key={user.id}
            user={user}
            showRestore
            isLoading={loadingAction === `restore-${user.id}`}
            onRestore={handleRestore}
          />
        ))
      )}
    </div>
  )
}