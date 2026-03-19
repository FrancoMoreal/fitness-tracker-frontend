"use client"

import { useAdminExercises, type CatalogExercise } from "@/hooks/use-admin-exercises"
import { usePaginationSearch } from "@/hooks/use-pagination-search"
import { CreateExerciseDialog } from "@/components/trainer/exercises/create-exercise-dialog"
import { SearchInput } from "@/components/shared/search-input"
import { PaginationControls } from "@/components/shared/pagination-controls"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dumbbell, Trash2, Loader2 } from "lucide-react"
import { CATEGORY_LABELS, MUSCLE_LABELS, DIFFICULTY_LABELS } from "@/types/exercise.types"

const PAGE_SIZE = 15

interface AdminExercisesClientProps {
  initialExercises: CatalogExercise[]
}

const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER:     "border-green-500/50 text-green-600",
  INTERMEDIATE: "border-yellow-500/50 text-yellow-600",
  ADVANCED:     "border-red-500/50 text-red-600",
}

export function AdminExercisesClient({ initialExercises }: AdminExercisesClientProps) {
  const { exercises, loadingAction, handleCreate, handleDelete } = useAdminExercises(initialExercises)

  const { search, setSearch, currentPage, setCurrentPage, totalPages, totalResults, paginated } =
    usePaginationSearch({
      data: exercises,
      searchFields: (e) => [
        e.name,
        CATEGORY_LABELS[e.category as keyof typeof CATEGORY_LABELS] ?? e.category,
        MUSCLE_LABELS[e.primaryMuscle as keyof typeof MUSCLE_LABELS] ?? e.primaryMuscle,
      ],
      pageSize: PAGE_SIZE,
    })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Catálogo de ejercicios</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {exercises.length} ejercicio{exercises.length !== 1 ? "s" : ""} en el catálogo general.
          </p>
        </div>
        <CreateExerciseDialog
          isLoading={loadingAction === "create"}
          onCreate={handleCreate}
        />
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por nombre, músculo o categoría..."
      />

      {paginated.length === 0 ? (
        <EmptyState
          icon={<Dumbbell className="h-8 w-8" />}
          title={search ? "Sin resultados" : "Sin ejercicios en el catálogo"}
          description={
            search
              ? `No se encontraron ejercicios para "${search}"`
              : "Agregá ejercicios al catálogo para que los trainers puedan usarlos."
          }
        />
      ) : (
        <div className="space-y-2">
          {paginated.map((exercise) => (
            <div
              key={exercise.id}
              className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-medium leading-tight">{exercise.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs text-muted-foreground">
                    {CATEGORY_LABELS[exercise.category as keyof typeof CATEGORY_LABELS] ?? exercise.category}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    {MUSCLE_LABELS[exercise.primaryMuscle as keyof typeof MUSCLE_LABELS] ?? exercise.primaryMuscle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className={DIFFICULTY_COLORS[exercise.difficulty] ?? ""}>
                  {DIFFICULTY_LABELS[exercise.difficulty as keyof typeof DIFFICULTY_LABELS] ?? exercise.difficulty}
                </Badge>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      disabled={loadingAction === `delete-${exercise.id}`}
                    >
                      {loadingAction === `delete-${exercise.id}` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar ejercicio?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Vas a eliminar <span className="font-semibold">{exercise.name}</span> del catálogo.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => handleDelete(exercise.id)}
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalResults}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}