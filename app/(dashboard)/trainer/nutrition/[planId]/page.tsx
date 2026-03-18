import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { getMyTrainerProfile } from "@/services/trainer.service"
import { NutritionEditorClient } from "@/components/trainer/nutrition-editor/nutrition-editor-client"
import type { NutritionPlanData } from "@/services/nutrition.service"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get("fitness_tracker_token")?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function getNutritionPlan(planId: number): Promise<NutritionPlanData | null> {
  try {
    const res = await fetch(`${API_URL}/api/nutrition-plans/${planId}`, {
      headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
      cache: "no-store",
    })
    if (!res.ok) return null
    return (await res.json()) as NutritionPlanData
  } catch {
    return null
  }
}

interface NutritionPlanEditorPageProps {
  params: Promise<{ planId: string }>
}

export default async function NutritionPlanEditorPage({ params }: NutritionPlanEditorPageProps) {
  const { planId } = await params
  const id = Number(planId)
  if (isNaN(id)) notFound()

  const [plan, trainer] = await Promise.all([
    getNutritionPlan(id),
    getMyTrainerProfile(),
  ])

  if (!plan || !trainer) notFound()
  if (plan.trainerId !== trainer.id) notFound()

 return (
  <NutritionEditorClient
    plan={plan}
    trainerId={trainer.id}
    memberId={plan.memberId} 
  />
)}