import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

export interface TrainerData {
  id: number
  externalId: string
  firstName: string
  lastName: string
  fullName?: string
  specialty?: string
  certifications?: string[]
  hourlyRate?: number
  isActive?: boolean
  assignedMembersCount?: number
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get("fitness_tracker_token")?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getAllTrainers(): Promise<TrainerData[]> {
  try {
    const response = await fetch(`${API_URL}/api/trainers`, {
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeader()),
      },
      cache: "no-store",
    })
    if (!response.ok) return []
    return (await response.json()) as TrainerData[]
  } catch {
    return []
  }
}

export async function getTrainerById(id: number): Promise<TrainerData | null> {
  try {
    const response = await fetch(`${API_URL}/api/trainers/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeader()),
      },
      cache: "no-store",
    })
    if (!response.ok) return null
    return (await response.json()) as TrainerData
  } catch {
    return null
  }
  
}
export async function getMyTrainerProfile(): Promise<TrainerData | null> {
  try {
    const response = await fetch(`${API_URL}/api/trainers/me`, {
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeader()),
      },
      cache: "no-store",
    })
    if (!response.ok) return null
    return (await response.json()) as TrainerData
  } catch {
    return null
  }
}