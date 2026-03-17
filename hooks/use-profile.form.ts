"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface UseProfileFormOptions<T> {
  onSave: (data: T) => Promise<{ success: boolean; error?: string }>
}

export function useProfileForm<T>({ onSave }: UseProfileFormOptions<T>) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: T) => {
    setIsSaving(true)
    try {
      const result = await onSave(data)
      if (!result.success) {
        toast.error("Error al guardar", { description: result.error ?? "Intenta de nuevo." })
        return
      }
      toast.success("Perfil actualizado")
      setIsEditing(false)
      router.refresh()
    } catch {
      toast.error("Error de conexión", { description: "Intenta de nuevo." })
    } finally {
      setIsSaving(false)
    }
  }

  return { isEditing, setIsEditing, isSaving, handleSave }
}