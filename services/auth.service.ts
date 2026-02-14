import { api, TOKEN_KEY, type ApiResponse } from "@/lib/api-client"
import type {
  MemberRegistrationData,
  TrainerRegistrationData,
} from "@/types/register.types"


// TIPOS


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

// SERVICIO DE AUTENTICACIÓN

export const authService = {
  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<AuthResponse>(
      "/auth/login",
      credentials,
      { skipAuth: true }
    )

    // Manejo explícito de error 
    if (!response.success) {
      return response
    }

    const token = response.data?.token
    const user = response.data?.user

    if (token) {
      this.saveToken(token)
      if (user) {
        this.saveUser(user)
      }
    } else {
      return {
        success: false,
        error: "Respuesta inválida del servidor (sin token)",
      }
    }

    return response
  },


  /**
   * Cerrar sesión
   */
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem("fitness_tracker_user")
    }
  },

  /**
   * Guardar token en localStorage
   */
  saveToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token)
    }
  },
  saveUser(user: any): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("fitness_tracker_user", JSON.stringify(user))
    }
  },
  getStoredUser(): any | null {
    if (typeof window === "undefined") return null
    try {
      const raw = localStorage.getItem("fitness_tracker_user")
      if (!raw) return null
      return JSON.parse(raw)
    } catch {
      return null
    }
  },
  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem(TOKEN_KEY)
  },

  // REGISTRO

  async registerMember(
    data: MemberRegistrationData
  ): Promise<ApiResponse<AuthResponse>> { 
    return api.post<AuthResponse>(
      "/auth/register/member",
      {
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
      },
      { skipAuth: true }
    )
  },
  
  async registerTrainer(
    data: TrainerRegistrationData
  ): Promise<ApiResponse<AuthResponse>> { 
    return api.post<AuthResponse>(
      "/auth/register/trainer",
      {
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        specialty: data.specialty,
        certifications: data.certifications,
        hourlyRate: data.hourlyRate,
      },
      { skipAuth: true }
    )
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


  // GESTIÓN DE CONTRASEÑAS
  
  validatePassword(password: string): PasswordValidation {
    if (password.length < 8) {
      return { valid: false, message: "Mínimo 8 caracteres" }
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: "Al menos una mayúscula" }
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: "Al menos una minúscula" }
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: "Al menos un número" }
    }
    if (!/[@$!%*?&]/.test(password)) {
      return { valid: false, message: "Al menos un carácter especial (@$!%*?&)" }
    }
    return { valid: true }
  },
  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<ApiResponse> {
    return api.post("/auth/change-password", {
      oldPassword,
      newPassword,
    })
  },

  async requestPasswordReset(email: string): Promise<ApiResponse> {
    return api.post(
      "/auth/forgot-password",
      { email },
      { skipAuth: true }
    )
  },

  /**
   * Resetear contraseña con token
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse> {
    return api.post(
      "/auth/reset-password",
      { token, newPassword },
      { skipAuth: true }
    )
  },

  // TOKENS Y SESIÓN

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<AuthResponse>(
      "/auth/refresh",
      { refreshToken },
      { skipAuth: true }
    )

    if (response.success && response.data?.token) {
      this.saveToken(response.data.token)
    }

    return response
  },

  /**
   * Verificar email (confirmación de cuenta)
   */
  async verifyEmail(token: string): Promise<ApiResponse> {
    return api.post(
      "/auth/verify-email",
      { token },
      { skipAuth: true }
    )
  },
}

export default authService