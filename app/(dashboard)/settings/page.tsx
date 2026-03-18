"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, KeyRound } from "lucide-react"

interface PasswordForm {
  currentPassword: string
  newPassword:     string
  confirmPassword: string
}

const INITIAL_FORM: PasswordForm = {
  currentPassword: "",
  newPassword:     "",
  confirmPassword: "",
}

export default function SettingsPage() {
  const router = useRouter()
  const [form, setForm]       = useState<PasswordForm>(INITIAL_FORM)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field: keyof PasswordForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Completá todos los campos")
      return
    }
    if (form.newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres")
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    setIsSaving(true)
    try {
      const response = await api.put("/api/users/change-password", {
        currentPassword: form.currentPassword,
        newPassword:     form.newPassword,
        confirmPassword: form.confirmPassword,
      })

      if (!response.success) {
        toast.error("Error al cambiar contraseña", {
          description: response.error ?? "Intenta de nuevo.",
        })
        return
      }

      toast.success("Contraseña actualizada correctamente")
      setForm(INITIAL_FORM)
      router.refresh()
    } catch {
      toast.error("Error de conexión", { description: "Intenta de nuevo." })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Configuración</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administrá la seguridad de tu cuenta.
        </p>
      </div>

      <Card className="mx-auto max-w-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <KeyRound className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Cambiar contraseña</p>
              <p className="text-sm text-muted-foreground">
                Usá una contraseña segura de al menos 6 caracteres.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="current-password">Contraseña actual</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="••••••••"
              value={form.currentPassword}
              onChange={handleChange("currentPassword")}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-password">Nueva contraseña</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="••••••••"
              value={form.newPassword}
              onChange={handleChange("newPassword")}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              disabled={isSaving}
            />
          </div>

          <Button
            className="w-full"
            disabled={isSaving}
            onClick={handleSubmit}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Actualizar contraseña
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}