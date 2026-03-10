"use client"

import { createContext, useCallback, useContext, useReducer } from "react"
import { useRouter } from "next/navigation"
import { storage } from "@/lib/storage"
import { Paths } from "@/lib/paths"
import { api } from "@/lib/api-client"

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface User {
  id: number
  username: string
  email?: string
  role?: string          // "USER" | "ADMIN"
  userType?: string      // "MEMBER" | "TRAINER"
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

// ── Estado inicial ────────────────────────────────────────────────────────────
// Ya no verifica localStorage por un token.
// La autenticación real la valida el middleware via cookie.
// Solo hidratamos el user para que el cliente no arranque en blanco.

function initAuthState(): AuthState {
  const user = storage.getUser<User>()
  return {
    isAuthenticated: !!user,
    user,
  }
}

function authReducer(state: AuthState, partial: Partial<AuthState>): AuthState {
  return { ...state, ...partial }
}

// ── Contexto ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [{ isAuthenticated, user }, dispatch] = useReducer(authReducer, null, initAuthState)


  const login = useCallback((user: User) => {
    storage.setUser(user)
    dispatch({ isAuthenticated: true, user })
  }, [])


  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout")
    } catch {
      // Si falla el request igual limpiamos el estado local
      console.warn("[Auth] Logout request falló, limpiando sesión local de todas formas")
    } finally {
      storage.clearSession()
      dispatch({ isAuthenticated: false, user: null })
      console.log("[Auth] Usuario cerró sesión")
      router.push(Paths.LOGIN)
    }
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