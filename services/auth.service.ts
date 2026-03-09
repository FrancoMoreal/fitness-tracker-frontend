import { api, type ApiResponse } from "@/lib/api-client"
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
    userType?: string   
    enabled?: boolean
  }
  member?: unknown
  trainer?: unknown
}

export interface PasswordValidation {
  valid: boolean
  message?: string
}

export const AuthService = {


  async login(credentials: LoginCredentials) {
    return api.post<AuthResponse>("/auth/login", credentials, { skipAuth: true })
  },


  async registerMember(data: MemberRegistrationData) {
    return api.post<AuthResponse>("/auth/register/member", { ...data }, { skipAuth: true })
  },

  async registerTrainer(data: TrainerRegistrationData) {
    return api.post<AuthResponse>("/auth/register/trainer", { ...data }, { skipAuth: true })
  },

  // ── Validaciones  ────────────────────────────────────────

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

  // ── Contraseñas ───────────────────────────────────────────────────────────

  validatePassword(password: string): PasswordValidation {
    if (password.length < 8)         return { valid: false, message: "Mínimo 8 caracteres" }
    if (!/[A-Z]/.test(password))     return { valid: false, message: "Al menos una mayúscula" }
    if (!/[a-z]/.test(password))     return { valid: false, message: "Al menos una minúscula" }
    if (!/[0-9]/.test(password))     return { valid: false, message: "Al menos un número" }
    if (!/[@$!%*?&]/.test(password)) return { valid: false, message: "Al menos un carácter especial (@$!%*?&)" }
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

  async verifyEmail(token: string): Promise<ApiResponse> {
    return api.post("/auth/verify-email", { token }, { skipAuth: true })
  },
}

export default AuthService