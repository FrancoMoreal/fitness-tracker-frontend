"use client"

import { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import {
  CATEGORY_LABELS,
  MUSCLE_LABELS,
  DIFFICULTY_LABELS,
} from "@/types/exercise.types"
import type { CreateExerciseForm } from "@/hooks/use-exercises"
import { INITIAL_EXERCISE_FORM } from "@/hooks/use-exercises"

interface CreateExerciseDialogProps {
  isLoading: boolean
  onCreate: (form: CreateExerciseForm) => Promise<boolean>
}

export function CreateExerciseDialog({ isLoading, onCreate }: CreateExerciseDialogProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CreateExerciseForm>(INITIAL_EXERCISE_FORM)

  const handleChange = (field: keyof CreateExerciseForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSelect = (field: keyof CreateExerciseForm) => (value: string) =>
    setForm((p) => ({ ...p, [field]: value }))

  const handleSubmit = async () => {
    const success = await onCreate(form)
    if (success) {
      setOpen(false)
      setForm(INITIAL_EXERCISE_FORM)
    }
  }

  const handleOpenChange = (value: boolean) => {
    if (!isLoading) {
      setOpen(value)
      if (!value) setForm(INITIAL_EXERCISE_FORM)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo ejercicio
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Crear ejercicio custom</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Nombre */}
          <div className="space-y-1.5">
            <Label htmlFor="ex-name">Nombre *</Label>
            <Input
              id="ex-name"
              placeholder="Ej: Sentadilla con barra alta"
              value={form.name}
              onChange={handleChange("name")}
              disabled={isLoading}
            />
          </div>

          {/* Categoría + Músculo */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Categoría *</Label>
              <Select value={form.category} onValueChange={handleSelect("category")} disabled={isLoading}>
                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Músculo principal *</Label>
              <Select value={form.primaryMuscle} onValueChange={handleSelect("primaryMuscle")} disabled={isLoading}>
                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  {Object.entries(MUSCLE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dificultad + Equipamiento */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Dificultad *</Label>
              <Select value={form.difficulty} onValueChange={handleSelect("difficulty")} disabled={isLoading}>
                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ex-equipment">Equipamiento</Label>
              <Input
                id="ex-equipment"
                placeholder="Ej: Barra, mancuernas"
                value={form.equipment}
                onChange={handleChange("equipment")}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <Label htmlFor="ex-description">Descripción</Label>
            <Textarea
              id="ex-description"
              placeholder="Descripción breve del ejercicio..."
              rows={2}
              value={form.description}
              onChange={handleChange("description")}
              disabled={isLoading}
            />
          </div>

          {/* Instrucciones */}
          <div className="space-y-1.5">
            <Label htmlFor="ex-instructions">Instrucciones</Label>
            <Textarea
              id="ex-instructions"
              placeholder="Pasos para ejecutar el ejercicio correctamente..."
              rows={3}
              value={form.instructions}
              onChange={handleChange("instructions")}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button className="flex-1" disabled={isLoading} onClick={handleSubmit}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear ejercicio
            </Button>
            <Button variant="outline" disabled={isLoading} onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}