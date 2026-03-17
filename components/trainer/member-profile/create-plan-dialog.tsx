"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus } from "lucide-react"
import { api } from "@/lib/api-client"
import { WorkoutPlanResponse, NutritionPlanResponse } from "@/types/plan.types"

interface CreatePlanDialogProps {
  type: "workout" | "nutrition"
  trainerId: number
  memberId: number
}

interface PlanFormState {
  name: string
  description: string
  startDate: string
  endDate: string
  notes: string
}

const INITIAL_FORM: PlanFormState = {
  name:        "",
  description: "",
  startDate:   new Date().toISOString().split("T")[0],
  endDate:     "",
  notes:       "",
}

const CONFIG = {
  workout: {
    label:       "plan de workout",
    endpoint:    "/api/workout-plans",
    redirectBase: "/trainer/routines",
  },
  nutrition: {
    label:       "plan nutricional",
    endpoint:    "/api/nutrition-plans",
    redirectBase: "/trainer/nutrition",
  },
}

export function CreatePlanDialog({ type, trainerId, memberId }: CreatePlanDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState<PlanFormState>(INITIAL_FORM)

  const config = CONFIG[type]

  const handleChange = (field: keyof PlanFormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("El nombre es obligatorio")
      return
    }
    if (!form.startDate) {
      toast.error("La fecha de inicio es obligatoria")
      return
    }

    setIsSaving(true)
    try {
      const response = type === "workout"
        ? await api.post<WorkoutPlanResponse>(
            `${config.endpoint}?trainerId=${trainerId}`,
            {
              name:        form.name.trim(),
              description: form.description.trim() || undefined,
              memberId,
              startDate:   form.startDate,
              endDate:     form.endDate || undefined,
              notes:       form.notes.trim() || undefined,
            }
          )
        : await api.post<NutritionPlanResponse>(
            `${config.endpoint}?trainerId=${trainerId}`,
            {
              name:        form.name.trim(),
              description: form.description.trim() || undefined,
              memberId,
              startDate:   form.startDate,
              endDate:     form.endDate || undefined,
              notes:       form.notes.trim() || undefined,
            }
          )

      if (!response.success || !response.data) {
        toast.error(`Error al crear ${config.label}`, {
          description: response.error ?? "Intenta de nuevo.",
        })
        return
      }

      toast.success(`${config.label.charAt(0).toUpperCase() + config.label.slice(1)} creado`)
      setOpen(false)
      setForm(INITIAL_FORM)
      router.push(`${config.redirectBase}/${response.data.id}`)
    } catch {
      toast.error("Error de conexión", { description: "Intenta de nuevo." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleOpenChange = (value: boolean) => {
    if (!isSaving) {
      setOpen(value)
      if (!value) setForm(INITIAL_FORM)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="mr-2 h-3.5 w-3.5" />
          Crear {config.label}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize">Nuevo {config.label}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="plan-name">Nombre *</Label>
            <Input
              id="plan-name"
              placeholder={type === "workout" ? "Plan de fuerza semana 1" : "Dieta hipocalórica"}
              value={form.name}
              onChange={handleChange("name")}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-description">Descripción</Label>
            <Textarea
              id="plan-description"
              placeholder="Descripción opcional del plan..."
              rows={2}
              value={form.description}
              onChange={handleChange("description")}
              disabled={isSaving}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="plan-start">Fecha inicio *</Label>
              <Input
                id="plan-start"
                type="date"
                value={form.startDate}
                onChange={handleChange("startDate")}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="plan-end">Fecha fin</Label>
              <Input
                id="plan-end"
                type="date"
                value={form.endDate}
                onChange={handleChange("endDate")}
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-notes">Notas</Label>
            <Textarea
              id="plan-notes"
              placeholder="Indicaciones adicionales..."
              rows={2}
              value={form.notes}
              onChange={handleChange("notes")}
              disabled={isSaving}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              className="flex-1"
              disabled={isSaving}
              onClick={handleSubmit}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear y continuar
            </Button>
            <Button
              variant="outline"
              disabled={isSaving}
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}