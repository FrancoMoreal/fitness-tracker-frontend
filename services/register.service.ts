import { getApiUrl } from "@/lib/api"
import type { MemberRegistrationData, TrainerRegistrationData } from "@/types/register.types"

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

const baseUrl = () => getApiUrl()

export const registerService = {
  async registerMember(data: MemberRegistrationData): Promise<ApiResponse> {
    console.log("[Register] Intentando registrar miembro", {
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
    })
    try {
      const url = `${baseUrl()}/auth/register/member`
      console.log("[Register] POST a:", url)
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        console.warn("[Register] Error al registrar miembro", {
          status: response.status,
          statusText: response.statusText,
          error: result.message ?? result.error,
        })
        return {
          success: false,
          error: result.message ?? result.error ?? "Error al registrar el miembro",
        }
      }

      console.log("[Register] Miembro registrado exitosamente", {
        username: data.username,
        email: data.email,
        responseData: result,
      })
      return { success: true, data: result, message: "Miembro registrado correctamente" }
    } catch (err) {
      console.error("[Register] Error de conexión al registrar miembro:", err)
      return {
        success: false,
        error: "Error de conexión. Intenta de nuevo.",
      }
    }
  },

  async registerTrainer(data: TrainerRegistrationData): Promise<ApiResponse> {
    console.log("[Register] Intentando registrar entrenador", {
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      specialty: data.specialty,
      certificationsCount: data.certifications.length,
      certifications: data.certifications,
      hourlyRate: data.hourlyRate,
    })
    try {
      const url = `${baseUrl()}/auth/register/trainer`
      console.log("[Register] POST a:", url)
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          specialty: data.specialty,
          certifications: data.certifications,
          hourlyRate: data.hourlyRate,
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        console.warn("[Register] Error al registrar entrenador", {
          status: response.status,
          statusText: response.statusText,
          error: result.message ?? result.error,
        })
        return {
          success: false,
          error: result.message ?? result.error ?? "Error al registrar el entrenador",
        }
      }

      console.log("[Register] Entrenador registrado exitosamente", {
        username: data.username,
        email: data.email,
        specialty: data.specialty,
        responseData: result,
      })
      return { success: true, data: result, message: "Entrenador registrado correctamente" }
    } catch (err) {
      console.error("[Register] Error de conexión al registrar entrenador:", err)
      return {
        success: false,
        error: "Error de conexión. Intenta de nuevo.",
      }
    }
  },

  /**
   * Contraseña: 8+ caracteres, mayúscula, minúscula, número y carácter especial (@$!%*?&)
   */
  validatePassword(password: string): { valid: boolean; message?: string } {
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
}

export default registerService
