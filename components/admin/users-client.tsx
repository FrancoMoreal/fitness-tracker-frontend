"use client"

import { useAdminUsers } from "@/hooks/use-admin-users"
import { usePaginationSearch } from "@/hooks/use-pagination-search"
import { AdminUserRow } from "@/components/admin/admin-user-row"
import { SearchInput } from "@/components/shared/search-input"
import { PaginationControls } from "@/components/shared/pagination-controls"
import { EmptyState } from "@/components/shared/empty-state"
import { Users } from "lucide-react"
import type { UserData } from "@/services/admin.service"

const PAGE_SIZE = 10

interface UsersClientProps {
  initialUsers: UserData[]
}

export function UsersClient({ initialUsers }: UsersClientProps) {
  const { users, loadingAction, handleDelete } = useAdminUsers(initialUsers)

  const { search, setSearch, currentPage, setCurrentPage, totalPages, totalResults, paginated } =
    usePaginationSearch({
      data: users,
      searchFields: (u) => [u.username, u.email, u.role, u.userType ?? ""],
      pageSize: PAGE_SIZE,
    })

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por nombre, email o rol..."
      />

      {paginated.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          title={search ? "Sin resultados" : "Sin usuarios"}
          description={search ? `No se encontraron usuarios para "${search}"` : undefined}
        />
      ) : (
        <div className="space-y-2">
          {paginated.map((user) => (
            <AdminUserRow
              key={user.id}
              user={user}
              isLoading={loadingAction === `delete-${user.id}`}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalResults}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}