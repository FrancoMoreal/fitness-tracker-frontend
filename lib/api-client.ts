// lib/api-client.ts

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

/**
 * Respuesta estandarizada de la API
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

/**
 * Configuración de logging
 */
const LOG_CONFIG = {
  enabled: process.env.NODE_ENV === "development",
  prefix: "[API]",
}

/**
 * Logger condicional - solo en desarrollo
 */
const logger = {
  info: (message: string, data?: unknown) => {
    if (LOG_CONFIG.enabled) {
      console.log(`${LOG_CONFIG.prefix} ${message}`, data || "")
    }
  },
  warn: (message: string, data?: unknown) => {
    if (LOG_CONFIG.enabled) {
      console.warn(`${LOG_CONFIG.prefix} ${message}`, data || "")
    }
  },
  error: (message: string, error?: unknown) => {
    if (LOG_CONFIG.enabled) {
      console.error(`${LOG_CONFIG.prefix} ${message}`, error || "")
    }
  },
}

/**
 * Opciones extendidas para las peticiones
 */
interface FetchOptions extends RequestInit {
  skipAuth?: boolean // Para endpoints públicos como login/register
}

/**
 * Cliente HTTP centralizado
 * Maneja automáticamente: headers, auth, errores, logging y parsing
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { skipAuth = false, ...fetchOptions } = options

  // Construir URL completa
  const url = `${getApiUrl()}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  // Configurar headers
  const headers = new Headers(fetchOptions.headers)
  headers.set("Content-Type", "application/json")

  // Agregar token si no se skipea auth
  if (!skipAuth) {
    const token = getToken()
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
  }

  logger.info(`${fetchOptions.method || "GET"} ${endpoint}`)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })

    const data = (await response.json().catch(() => ({}))) as ApiResponse<T>

    if (!response.ok) {
      const errorMessage =
        data.message || data.error || `Error ${response.status}`

      logger.warn(`Error en ${endpoint}`, {
        status: response.status,
        error: errorMessage,
      })

      return {
        success: false,
        error: errorMessage,
      }
    }

    logger.info(`✓ ${endpoint}`, data.data ? "OK" : "")

    // Si el backend ya retorna { success, data, message }
    if ("success" in data) {
      return data
    }

    // Si no, lo envolvemos
    return {
      success: true,
      data: data as T,
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error de conexión"

    logger.error(`Error de red en ${endpoint}`, error)

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Métodos de conveniencia
 */
export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    apiClient<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
}
