"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import type { AddMealForm } from "@/hooks/use-nutrition-editor"

interface AddMealFormProps {
  nextOrder: number
  isLoading: boolean
  onAdd: (form: AddMealForm) => Promise<unknown>
}

const MEAL_TYPES = [
  { value: "BREAKFAST",    label: "Desayuno" },
  { value: "LUNCH",        label: "Almuerzo" },
  { value: "DINNER",       label: "Cena" },
  { value: "SNACK",        label: "Snack" },
  { value: "PRE_WORKOUT",  label: "Pre-entreno" },
  { value: "POST_WORKOUT", label: "Post-entreno" },
]

const INITIAL_FORM: AddMealForm = {
  mealType:    "",
  name:        "",
  calories:    "",
  protein:     "",
  carbs:       "",
  fat:         "",
  foods:       "",
  notes:       "",
  orderInPlan: 1,
}

export function AddMealForm({ nextOrder, isLoading, onAdd }: AddMealFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState<AddMealForm>({ ...INITIAL_FORM, orderInPlan: nextOrder })

  const handleChange = (field: keyof AddMealForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async () => {
    const result = await onAdd(form)
    if (result) {
      setForm({ ...INITIAL_FORM, orderInPlan: nextOrder + 1 })
      setIsOpen(false)
    }
  }

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Agregar comida
      </Button>
    )
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
      <p className="text-sm font-medium">Nueva comida</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Tipo *</Label>
          <Select
            value={form.mealType}
            onValueChange={(v) => setForm((p) => ({ ...p, mealType: v }))}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {MEAL_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="meal-name">Nombre *</Label>
          <Input
            id="meal-name"
            placeholder="Ej: Desayuno proteico"
            value={form.name}
            onChange={handleChange("name")}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="calories">Calorías</Label>
          <Input
            id="calories" type="number" min={0} placeholder="kcal"
            value={form.calories} onChange={handleChange("calories")} disabled={isLoading}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="protein">Proteínas (g)</Label>
          <Input
            id="protein" type="number" min={0} step="0.1" placeholder="g"
            value={form.protein} onChange={handleChange("protein")} disabled={isLoading}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="carbs">Carbos (g)</Label>
          <Input
            id="carbs" type="number" min={0} step="0.1" placeholder="g"
            value={form.carbs} onChange={handleChange("carbs")} disabled={isLoading}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fat">Grasas (g)</Label>
          <Input
            id="fat" type="number" min={0} step="0.1" placeholder="g"
            value={form.fat} onChange={handleChange("fat")} disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="foods">Alimentos</Label>
        <Textarea
          id="foods"
          placeholder="Ej: 200g pollo, 1 taza arroz integral, 1 cucharada aceite de oliva"
          rows={2}
          value={form.foods}
          onChange={handleChange("foods")}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="meal-notes">Notas</Label>
        <Input
          id="meal-notes"
          placeholder="Indicaciones opcionales..."
          value={form.notes}
          onChange={handleChange("notes")}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-2">
        <Button size="sm" disabled={isLoading} onClick={handleSubmit}>
          {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
          Agregar
        </Button>
        <Button size="sm" variant="ghost" disabled={isLoading} onClick={() => setIsOpen(false)}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}