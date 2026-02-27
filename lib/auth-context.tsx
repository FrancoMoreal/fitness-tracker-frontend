"use client"

import { createContext, useCallback, useContext, useReducer } from "react"
import { useRouter } from "next/navigation"
import { storage } from "@/lib/storage"
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

function initAuthState(): AuthState {
  const token = storage.getToken()
  return {
    isAuthenticated: !!token,
    user: token ? storage.getUser<User>() : null,
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
    storage.clearSession() // una sola llamada
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