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
  dateOfBirth?: string
  membershipStartDate?: string
  membershipEndDate?: string
  remainingDays?: number
  height?: number
  weight?: number
  isActive?: boolean
  assignmentStatus: "NO_TRAINER" | "PENDING" | "ACTIVE" | "REJECTED" | "CANCELLED"
  assignedTrainerId?: number
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get("fitness_tracker_token")?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getMyMemberProfile(): Promise<MemberData | null> {
  try {
    const response = await fetch(`${API_URL}/api/members/me`, {
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeader()),
      },
      cache: "no-store",
    })
    if (!response.ok) return null
    return (await response.json()) as MemberData
  } catch {
    return null
  }
}

export async function getMembersByTrainer(trainerId: number): Promise<MemberData[]> {
  try {
    const response = await fetch(`${API_URL}/api/members/trainer/${trainerId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeader()),
      },
      cache: "no-store",
    })
    if (!response.ok) return []
    return (await response.json()) as MemberData[]
  } catch {
    return []
  }
}

export async function getMemberById(id: number): Promise<MemberData | null> {
  try {
    const response = await fetch(`${API_URL}/api/members/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeader()),
      },
      cache: "no-store",
    })
    if (!response.ok) return null
    return (await response.json()) as MemberData
  } catch {
    return null
  }
}