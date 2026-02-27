import { api, type ApiResponse } from "@/lib/api-client"
import { storage } from "@/lib/storage"
import type {
  MemberRegistrationData,
  TrainerRegistrationData,
} from "@/types/register.types"

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
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
}

export interface RegisterResponse {
  id: number
  username: string
  email: string
  role: string
}

export interface PasswordValidation {
  valid: boolean
  message?: string
}

export const AuthService = {

  // SESIÓN

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<AuthResponse>("/auth/login", credentials, { skipAuth: true })

    if (!response.success) return response

    const { token, user } = response.data ?? {}

    if (!token) {
      return { success: false, error: "Respuesta inválida del servidor (sin token)" }
    }

    //  Delega la persistencia a storage
    storage.setToken(token)
    if (user) storage.setUser(user)

    return response
  },

  logout(): void {
    storage.clearSession() // una sola llamada
  },

  isAuthenticated(): boolean {
    return !!storage.getToken()
  },


  // REGISTRO

  async registerMember(data: MemberRegistrationData): Promise<ApiResponse<AuthResponse>> {
    return api.post<AuthResponse>("/auth/register/member", {
      username:    data.username,
      email:       data.email,
      password:    data.password,
      firstName:   data.firstName,
      lastName:    data.lastName,
      phone:       data.phone,
      dateOfBirth: data.dateOfBirth,
    }, { skipAuth: true })
  },

  async registerTrainer(data: TrainerRegistrationData): Promise<ApiResponse<AuthResponse>> {
    return api.post<AuthResponse>("/auth/register/trainer", {
      username:       data.username,
      email:          data.email,
      password:       data.password,
      firstName:      data.firstName,
      lastName:       data.lastName,
      specialty:      data.specialty,
      certifications: data.certifications,
      hourlyRate:     data.hourlyRate,
    }, { skipAuth: true })
  },

  async checkUsernameExists(username: string): Promise<boolean> {
    const response = await api.get<{ exists: boolean }>(
      `/auth/check-username?username=${encodeURIComponent(username)}`,
      { skipAuth: true }
    )
    return response.data?.exists ?? false
  },

  async checkEmailExists(email: string): Promise<boolean> {
    const response = await api.get<{ exists: boolean }>(
      `/auth/check-email?email=${encodeURIComponent(email)}`,
      { skipAuth: true }
    )
    return response.data?.exists ?? false
  },

  // CONTRASEÑAS

  validatePassword(password: string): PasswordValidation {
    if (password.length < 8)          return { valid: false, message: "Mínimo 8 caracteres" }
    if (!/[A-Z]/.test(password))      return { valid: false, message: "Al menos una mayúscula" }
    if (!/[a-z]/.test(password))      return { valid: false, message: "Al menos una minúscula" }
    if (!/[0-9]/.test(password))      return { valid: false, message: "Al menos un número" }
    if (!/[@$!%*?&]/.test(password))  return { valid: false, message: "Al menos un carácter especial (@$!%*?&)" }
    return { valid: true }
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse> {
    return api.post("/auth/change-password", { oldPassword, newPassword })
  },

  async requestPasswordReset(email: string): Promise<ApiResponse> {
    return api.post("/auth/forgot-password", { email }, { skipAuth: true })
  },

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    return api.post("/auth/reset-password", { token, newPassword }, { skipAuth: true })
  },

  // TOKENS

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<AuthResponse>(
      "/auth/refresh",
      { refreshToken },
      { skipAuth: true }
    )
    if (response.success && response.data?.token) {
      storage.setToken(response.data.token) // ✅
    }
    return response
  },

  async verifyEmail(token: string): Promise<ApiResponse> {
    return api.post("/auth/verify-email", { token }, { skipAuth: true })
  },
}

export default AuthService
