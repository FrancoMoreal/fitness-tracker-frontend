"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProfileInfoItem } from "@/components/profile/profile-info-item"
import { useProfileForm } from "@/hooks/use-profile.form"
import { api } from "@/lib/api-client"
import { Pencil, X, Loader2, Phone, Ruler, Weight } from "lucide-react"
import type { MemberData } from "@/services/member.service"

interface MemberProfileFormProps {
  member: MemberData
}

interface MemberFormState {
  firstName: string
  lastName: string
  phone: string
  height: string
  weight: string
}

export function MemberProfileForm({ member }: MemberProfileFormProps) {
  const [form, setForm] = useState<MemberFormState>({
    firstName: member.firstName,
    lastName:  member.lastName,
    phone:     member.phone     ?? "",
    height:    member.height    ? String(member.height) : "",
    weight:    member.weight    ? String(member.weight) : "",
  })

  const { isEditing, setIsEditing, isSaving, handleSave } = useProfileForm({
    onSave: async (data: MemberFormState) => {
      return api.put(`/api/members/${member.id}`, {
        firstName: data.firstName,
        lastName:  data.lastName,
        phone:     data.phone,
        height:    data.height ? Number(data.height) : undefined,
        weight:    data.weight ? Number(data.weight) : undefined,
      })
    },
  })

  const fullName = member.fullName ?? `${member.firstName} ${member.lastName}`
  const initials = fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  const handleCancel = () => {
    setForm({
      firstName: member.firstName,
      lastName:  member.lastName,
      phone:     member.phone     ?? "",
      height:    member.height    ? String(member.height) : "",
      weight:    member.weight    ? String(member.weight) : "",
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
              {member.email && (
                <p className="mt-0.5 text-sm text-muted-foreground">{member.email}</p>
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
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="height">Altura (m)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.01"
                  placeholder="1.75"
                  value={form.height}
                  onChange={(e) => setForm((p) => ({ ...p, height: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70"
                  value={form.weight}
                  onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <ProfileInfoItem
              label="Teléfono"
              value={member.phone}
              icon={<Phone className="h-4 w-4" />}
            />
            <ProfileInfoItem
              label="Altura"
              value={member.height ? `${member.height} m` : null}
              icon={<Ruler className="h-4 w-4" />}
            />
            <ProfileInfoItem
              label="Peso"
              value={member.weight ? `${member.weight} kg` : null}
              icon={<Weight className="h-4 w-4" />}
            />
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