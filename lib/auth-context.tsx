"use client"

import { createContext, useCallback, useContext, useReducer } from "react"
import { useRouter } from "next/navigation"
import { getToken, TOKEN_KEY } from "@/lib/api-client"
import { Paths } from "@/lib/paths"
export interface User {
  id: number
  username: string
  email?: string
  role?: string
  enabled?: boolean
}

type AuthState = {
  isAuthenticated: boolean
  user: User | null
}

type AuthContextValue = AuthState & {
  login: (user: User) => void
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

function initAuthState(): AuthState {
  if (typeof window === "undefined") return { isAuthenticated: false, user: null }
  const token = getToken()
  return {
    isAuthenticated: !!token,
    user: token ? getStoredUser() : null,
  }
}

function authReducer(state: AuthState, partial: Partial<AuthState>): AuthState {
  return { ...state, ...partial }
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [{ isAuthenticated, user }, dispatch] = useReducer(authReducer, null, initAuthState)

  const login = useCallback((user: User) => {
    dispatch({ isAuthenticated: true, user })
  }, [])

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
    dispatch({ isAuthenticated: false, user: null })
    console.log("[Auth] Usuario cerró sesión")
    router.push(Paths.LOGIN)
  }, [router])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}