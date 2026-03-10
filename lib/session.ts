import { cookies } from "next/headers"

const COOKIE_NAME = "fitness_tracker_token"

export interface SessionPayload {
  sub: string        // username
  role: string       // "USER" | "ADMIN"
  userType: string   // "MEMBER" | "TRAINER"
  email: string
  exp: number
  iat: number
}


function decodeJwtPayload(token: string): SessionPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const base64  = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const padded  = base64 + "=".repeat((4 - (base64.length % 4)) % 4)
    const decoded = Buffer.from(padded, "base64").toString("utf-8")
    return JSON.parse(decoded) as SessionPayload
  } catch {
    return null
  }
}

function isExpired(payload: SessionPayload): boolean {
  return Date.now() >= payload.exp * 1000
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  const payload = decodeJwtPayload(token)
  if (!payload || isExpired(payload)) return null

  return payload
}
