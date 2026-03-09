export const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

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

const logger = {
  info: (message: string, data?: unknown) => {
    if (LOG_CONFIG.enabled) console.log(`${LOG_CONFIG.prefix} ${message}`, data || "")
  },
  warn: (message: string, data?: unknown) => {
    if (LOG_CONFIG.enabled) console.warn(`${LOG_CONFIG.prefix} ${message}`, data || "")
  },
  error: (message: string, error?: unknown) => {
    if (LOG_CONFIG.enabled) console.error(`${LOG_CONFIG.prefix} ${message}`, error || "")
  },
}


interface FetchOptions extends RequestInit {
  skipAuth?: boolean // Reservado para endpoints que no requieren cookie (actualmente no usado)
}


export async function apiClient<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { skipAuth: _skipAuth, ...fetchOptions } = options

  const url = `${getApiUrl()}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const headers = new Headers(fetchOptions.headers)
  headers.set("Content-Type", "application/json")
  
  logger.info(`${fetchOptions.method || "GET"} ${endpoint}`)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      credentials: "include",
    })

    const data = (await response.json().catch(() => ({}))) as ApiResponse<T>

    if (!response.ok) {
      const errorMessage = data.message || data.error || `Error ${response.status}`
      logger.warn(`Error en ${endpoint}`, { status: response.status, error: errorMessage })
      return { success: false, error: errorMessage }
    }

    logger.info(`✓ ${endpoint}`, data.data ? "OK" : "")

    if ("success" in data) return data

    return { success: true, data: data as T }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error de conexión"
    logger.error(`Error de red en ${endpoint}`, error)
    return { success: false, error: errorMessage }
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