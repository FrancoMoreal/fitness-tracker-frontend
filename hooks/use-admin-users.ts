"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import type { UserData } from "@/services/admin.service"

export function useAdminUsers(initialUsers: UserData[]) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [users, setUsers] = useState<UserData[]>(initialUsers)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const handleDelete = async (userId: number) => {
    setLoadingAction(`delete-${userId}`)
    try {
      const response = await api.delete(`/api/users/${userId}`)
      if (!response.success) {
        toast.error("Error al eliminar usuario", { description: response.error })
        return
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      toast.success("Usuario eliminado")
    } catch {
      toast.error("Error de conexión")
    } finally {
      setLoadingAction(null)
    }
  }

  const handleRestore = async (userId: number) => {
    setLoadingAction(`restore-${userId}`)
    try {
      const response = await api.post(`/api/users/${userId}/restore`)
      if (!response.success) {
        toast.error("Error al restaurar usuario", { description: response.error })
        return
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      toast.success("Usuario restaurado")
      startTransition(() => router.refresh())
    } catch {
      toast.error("Error de conexión")
    } finally {
      setLoadingAction(null)
    }
  }

  return { users, loadingAction, isPending, handleDelete, handleRestore }
}