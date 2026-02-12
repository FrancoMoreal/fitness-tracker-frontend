"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getToken, TOKEN_KEY } from "@/lib/api-client"

/** Usuario logueado; coincide con lo que devuelve el backend en AuthResponse.user */
export interface User {
  id: number
  username: string
  email?: string
  role?: string
  enabled?: boolean
}

type AuthContextValue = {
  isAuthenticated: boolean
  user: User | null
  setAuthenticated: (value: boolean) => void
  setUser: (user: User | null) => void
  logout: () => void
}

const USER_KEY = "fitness_tracker_user"

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = getToken()
    setAuthenticated(!!token)
    if (token) setUser(getStoredUser())
    else setUser(null)
  }, [])

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
    setAuthenticated(false)
    setUser(null)
    console.log("[Auth] Usuario cerró sesión")
    router.push("/login")
    router.refresh()
  }, [router])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setAuthenticated, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
