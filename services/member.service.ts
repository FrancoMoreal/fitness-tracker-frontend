import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

export interface MemberData {
  id: number
  externalId: string
  firstName: string
  lastName: string
  fullName?: string
  email?: string
  phone?: string
  assignedTrainerId?: number
  assignmentStatus: "NO_TRAINER" | "PENDING" | "ACTIVE" | "REJECTED" | "CANCELLED"
  membershipStartDate?: string
  membershipEndDate?: string
  remainingDays?: number
  height?: number
  weight?: number
  isActive?: boolean
}

/**
 * Obtiene el perfil del member autenticado via /api/members/me.
 * El backend resuelve el member desde el JWT — no necesita parámetros.
 * Usado server-side en el dashboard dispatcher.
 */
export async function getMyMemberProfile(): Promise<MemberData | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("fitness_tracker_token")?.value
    if (!token) return null

    const response = await fetch(`${API_URL}/api/members/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!response.ok) return null
    return (await response.json()) as MemberData
  } catch {
    return null
  }
}