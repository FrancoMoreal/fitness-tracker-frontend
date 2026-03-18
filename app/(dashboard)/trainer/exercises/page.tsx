import { notFound } from "next/navigation"
import { getMyTrainerProfile } from "@/services/trainer.service"
import { getCustomExercisesByTrainer } from "@/services/exercise.service"
import { ExercisesClient } from "@/components/trainer/exercises/exercises-client"

export default async function TrainerExercisesPage() {
  const trainer = await getMyTrainerProfile()
  if (!trainer) notFound()

  const exercises = await getCustomExercisesByTrainer(trainer.id)

  return (
    <ExercisesClient
      trainerId={trainer.id}
      initialExercises={exercises}
    />
  )
}