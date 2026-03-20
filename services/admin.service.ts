import { cookies } from "next/headers"
import type { MemberData } from "@/services/member.service"
import type { TrainerData } from "@/services/trainer.service"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

export interface UserData {
  id: number
  externalId: string
  username: string
  email: string
  enabled: boolean
  role: "USER" | "ADMIN"
  userType?: "MEMBER" | "TRAINER"
  createdAt: string
  updatedAt?: string
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get("fitness_tracker_token")?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
      cache: "no-store",
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export async function getAllUsers(): Promise<UserData[]> {
  return (await fetchJson<UserData[]>(`${API_URL}/api/users`)) ?? []
}

export async function getDeletedUsers(): Promise<UserData[]> {
  return (await fetchJson<UserData[]>(`${API_URL}/api/users/deleted`)) ?? []
}

export async function getAllMembers(): Promise<MemberData[]> {
  return (await fetchJson<MemberData[]>(`${API_URL}/api/members`)) ?? []
}

export async function getAllTrainers(): Promise<TrainerData[]> {
  return (await fetchJson<TrainerData[]>(`${API_URL}/api/trainers`)) ?? []
}

export async function getAllCatalogExercises() {
  return (await fetchJson<{ id: number; name: string; category: string; primaryMuscle: string; difficulty: string; isCustom: boolean }[]>(
    `${API_URL}/api/exercises/catalog`
  )) ?? []
}