"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProfileInfoItem } from "@/components/profile/profile-info-item"
import { useProfileForm } from "@/hooks/use-profile.form"
import { api } from "@/lib/api-client"
import { Pencil, X, Loader2, Dumbbell, DollarSign } from "lucide-react"
import type { TrainerData } from "@/services/trainer.service"

interface TrainerProfileFormProps {
  trainer: TrainerData
}

interface TrainerFormState {
  firstName: string
  lastName: string
  specialty: string
  hourlyRate: string
}

export function TrainerProfileForm({ trainer }: TrainerProfileFormProps) {
  const fullName = trainer.fullName ?? `${trainer.firstName} ${trainer.lastName}`

  const [form, setForm] = useState<TrainerFormState>({
    firstName:  trainer.firstName,
    lastName:   trainer.lastName,
    specialty:  trainer.specialty  ?? "",
    hourlyRate: trainer.hourlyRate ? String(trainer.hourlyRate) : "",
  })

  const { isEditing, setIsEditing, isSaving, handleSave } = useProfileForm({
    onSave: async (data: TrainerFormState) => {
      return api.put(`/api/trainers/${trainer.id}`, {
        firstName:  data.firstName,
        lastName:   data.lastName,
        specialty:  data.specialty,
        hourlyRate: data.hourlyRate ? Number(data.hourlyRate) : undefined,
        isActive:   trainer.isActive ?? true,
      })
    },
  })

  const initials = fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  const handleCancel = () => {
    setForm({
      firstName:  trainer.firstName,
      lastName:   trainer.lastName,
      specialty:  trainer.specialty  ?? "",
      hourlyRate: trainer.hourlyRate ? String(trainer.hourlyRate) : "",
    })
    setIsEditing(false)
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {initials}
            </div>
            <div>
              <p className="text-lg font-semibold leading-tight">{fullName}</p>
              {trainer.specialty && (
                <p className="mt-0.5 text-sm text-muted-foreground">{trainer.specialty}</p>
              )}
            </div>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Editar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="specialty">Especialidad</Label>
              <Input
                id="specialty"
                value={form.specialty}
                onChange={(e) => setForm((p) => ({ ...p, specialty: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hourlyRate">Tarifa horaria ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                step="0.01"
                placeholder="50.00"
                value={form.hourlyRate}
                onChange={(e) => setForm((p) => ({ ...p, hourlyRate: e.target.value }))}
              />
            </div>
          </div>
        ) : (
          <>
            <ProfileInfoItem
              label="Especialidad"
              value={trainer.specialty}
              icon={<Dumbbell className="h-4 w-4" />}
            />
            <ProfileInfoItem
              label="Tarifa horaria"
              value={trainer.hourlyRate ? `$${trainer.hourlyRate} / hora` : null}
              icon={<DollarSign className="h-4 w-4" />}
            />
            {trainer.certifications && trainer.certifications.length > 0 && (
              <ProfileInfoItem
                label="Certificaciones"
                value={trainer.certifications.join(", ")}
              />
            )}
          </>
        )}
      </CardContent>

      {isEditing && (
        <CardFooter className="gap-2 border-t pt-4">
          <Button
            className="flex-1"
            disabled={isSaving}
            onClick={() => handleSave(form)}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
          <Button variant="outline" disabled={isSaving} onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}