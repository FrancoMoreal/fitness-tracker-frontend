"use client"

import { useState, useMemo } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Loader2, Search } from "lucide-react"
import { ExerciseData, MUSCLE_LABELS, CATEGORY_LABELS } from "@/types/exercise.types"


interface AddExerciseDialogProps {
  dayId: number
  nextOrder: number
  exercises: ExerciseData[]
  isLoading: boolean
  onAdd: (dayId: number, form: {
    exerciseId: number
    sets: number
    reps: number
    weight?: number
    restSeconds?: number
    orderInWorkout: number
    notes: string
  }) => Promise<boolean>
}

const INITIAL_FORM = { sets: 3, reps: 12, weight: "", restSeconds: "", notes: "" }

export function AddExerciseDialog({
  dayId, nextOrder, exercises, isLoading, onAdd,
}: AddExerciseDialogProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<ExerciseData | null>(null)
  const [form, setForm] = useState(INITIAL_FORM)

  const filtered = useMemo(() => {
    if (!search.trim()) return exercises
    const q = search.toLowerCase()
    return exercises.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        MUSCLE_LABELS[e.primaryMuscle]?.toLowerCase().includes(q) ||
        CATEGORY_LABELS[e.category]?.toLowerCase().includes(q)
    )
  }, [exercises, search])

  const handleSubmit = async () => {
    if (!selected) {
      return
    }
    const success = await onAdd(dayId, {
      exerciseId:     selected.id,
      sets:           form.sets,
      reps:           form.reps,
      weight:         form.weight ? Number(form.weight) : undefined,
      restSeconds:    form.restSeconds ? Number(form.restSeconds) : undefined,
      orderInWorkout: nextOrder,
      notes:          form.notes,
    })
    if (success) {
      setOpen(false)
      setSelected(null)
      setSearch("")
      setForm(INITIAL_FORM)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!isLoading) setOpen(v) }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Agregar ejercicio
        </Button>
      </DialogTrigger>

     <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Agregar ejercicio</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar por nombre o músculo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Lista de ejercicios */}
          <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border p-1">
            {filtered.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Sin resultados</p>
            ) : (
              filtered.map((exercise) => (
                <button
                  key={exercise.id}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                    selected?.id === exercise.id ? "bg-primary/10 font-medium" : ""
                  }`}
                  onClick={() => setSelected(exercise)}
                >
                  <span className="font-medium">{exercise.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {MUSCLE_LABELS[exercise.primaryMuscle]} · {CATEGORY_LABELS[exercise.category]}
                  </span>
                  {exercise.isCustom && (
                    <Badge variant="outline" className="ml-2 text-xs">Custom</Badge>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Config del ejercicio */}
          {selected && (
            <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
              <p className="text-sm font-medium">{selected.name}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Series</Label>
                  <Input
                    type="number" min={1}
                    value={form.sets}
                    onChange={(e) => setForm((p) => ({ ...p, sets: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Repeticiones</Label>
                  <Input
                    type="number" min={1}
                    value={form.reps}
                    onChange={(e) => setForm((p) => ({ ...p, reps: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Peso (kg)</Label>
                  <Input
                    type="number" step="0.5" placeholder="Opcional"
                    value={form.weight}
                    onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Descanso (seg)</Label>
                  <Input
                    type="number" min={0} placeholder="Opcional"
                    value={form.restSeconds}
                    onChange={(e) => setForm((p) => ({ ...p, restSeconds: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Notas</Label>
                <Input
                  placeholder="Opcional"
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button className="flex-1" disabled={!selected || isLoading} onClick={handleSubmit}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Agregar al día
            </Button>
            <Button variant="outline" disabled={isLoading} onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}