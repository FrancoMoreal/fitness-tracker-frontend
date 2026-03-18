export type ExerciseCategory = "CARDIO" | "STRENGTH" | "FLEXIBILITY" | "BALANCE" | "SPORTS"
export type MuscleGroup = "CHEST" | "BACK" | "SHOULDERS" | "BICEPS" | "TRICEPS" | "FOREARMS" | "ABS" | "OBLIQUES" | "LOWER_BACK" | "QUADS" | "HAMSTRINGS" | "GLUTES" | "CALVES" | "FULL_BODY" | "CARDIO"
export type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED"

export interface ExerciseData {
  id: number
  externalId: string
  name: string
  description?: string
  category: ExerciseCategory
  primaryMuscle: MuscleGroup
  difficulty: DifficultyLevel
  isCustom?: boolean
  equipment?: string
  instructions?: string
}

export const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  CARDIO:      "Cardio",
  STRENGTH:    "Fuerza",
  FLEXIBILITY: "Flexibilidad",
  BALANCE:     "Equilibrio",
  SPORTS:      "Deportes",
}

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  CHEST:      "Pecho",
  BACK:       "Espalda",
  SHOULDERS:  "Hombros",
  BICEPS:     "Bíceps",
  TRICEPS:    "Tríceps",
  FOREARMS:   "Antebrazos",
  ABS:        "Abdominales",
  OBLIQUES:   "Oblicuos",
  LOWER_BACK: "Espalda baja",
  QUADS:      "Cuádriceps",
  HAMSTRINGS: "Isquiotibiales",
  GLUTES:     "Glúteos",
  CALVES:     "Pantorrillas",
  FULL_BODY:  "Cuerpo completo",
  CARDIO:     "Cardio",
}

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  BEGINNER:     "Principiante",
  INTERMEDIATE: "Intermedio",
  ADVANCED:     "Avanzado",
}