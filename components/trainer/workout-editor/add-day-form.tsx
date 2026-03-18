"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"

interface AddDayFormProps {
  nextDayNumber: number
  isLoading: boolean
  onAdd: (form: { dayName: string; dayNumber: number; notes: string }) => Promise<boolean>
}

export function AddDayForm({ nextDayNumber, isLoading, onAdd }: AddDayFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ dayName: "", dayNumber: nextDayNumber, notes: "" })

  const handleSubmit = async () => {
    const success = await onAdd(form)
    if (success) {
      setForm({ dayName: "", dayNumber: nextDayNumber + 1, notes: "" })
      setIsOpen(false)
    }
  }

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Agregar día
      </Button>
    )
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
      <p className="text-sm font-medium">Nuevo día de entrenamiento</p>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="day-name">Nombre del día *</Label>
          <Input
            id="day-name"
            placeholder="Ej: Pecho y tríceps"
            value={form.dayName}
            onChange={(e) => setForm((p) => ({ ...p, dayName: e.target.value }))}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="day-number">Número</Label>
          <Input
            id="day-number"
            type="number"
            min={1}
            value={form.dayNumber}
            onChange={(e) => setForm((p) => ({ ...p, dayNumber: Number(e.target.value) }))}
            disabled={isLoading}
          />
        </div>
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