/**
 * URL base del backend. En desarrollo usa localhost:8080 si no está definida.
 * Crea .env.local con: NEXT_PUBLIC_API_URL=http://localhost:8080
 */
export const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

/** Clave con la que se guarda el JWT en localStorage */
export const TOKEN_KEY = "fitness_tracker_token"

/** Devuelve el token guardado (solo en el cliente). */
export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export async function fetchWithAuth(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${getApiUrl()}${path.startsWith("/") ? path : `/${path}`}`
  const token = getToken()
  const headers = new Headers(options.headers)
  headers.set("Content-Type", "application/json")
  if (token) headers.set("Authorization", `Bearer ${token}`)
  return fetch(url, { ...options, headers })
}

export type AuthResponse = {
  token: string
  type?: string
  user?: {
    id: number
    username: string
    email?: string
    role?: string
    enabled?: boolean
  }
  member?: unknown
  trainer?: unknown
  expiresAt?: string
  refreshToken?: string
  message?: string
}

export type LoginCredentials = {
  username: string
  password: string
}

export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const base = getApiUrl()
  const res = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : data.error ?? "Credenciales inválidas"
    throw new Error(message)
  }
  return data as AuthResponse
}
