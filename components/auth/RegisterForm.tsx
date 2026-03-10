"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { toast } from "sonner"
import { User, Dumbbell, Mail, Lock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Paths } from "@/lib/paths"
import AuthService from "@/services/auth.service"
import type { MemberRegistrationData, TrainerRegistrationData } from "@/types/register.types"
import { RegisterTypeSelector, UserTypeEnum } from "@/components/auth/RegisterTypeSelector"
import { MemberFields, type MemberFieldsData } from "@/components/auth/MemberFields"
import { TrainerFields, type TrainerFieldsData } from "@/components/auth/TrainerFields"


interface FormData {
  username: string
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  // Member-specific
  phone: string
  dateOfBirth: string
  // Trainer-specific
  specialty: string
  certificationsText: string
  hourlyRate: string
}

const INITIAL_FORM: FormData = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  dateOfBirth: "",
  specialty: "",
  certificationsText: "",
  hourlyRate: "",
}


function validateUsername(
  username: string,
  errors: Record<string, string>,
  userType: UserTypeEnum | null,
) {
  if (!username.trim()) {
    errors.username = "El usuario es requerido"
  } else if (username.length < 3 || username.length > 50) {
    errors.username = "Entre 3 y 50 caracteres"
  } else if (userType === UserTypeEnum.TRAINER && !/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.username = "Solo letras, números, guión y guión bajo"
  }
}

export function RegisterForm() {
  const { login } = useAuth()
  const router = useRouter()
  const [userType, setUserType] = useState<UserTypeEnum | null>(null)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleTypeSelect = (type: UserTypeEnum | null) => {
    setUserType(type)
    if (type === null) {
      setFormData(INITIAL_FORM)
      setErrors({})
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    validateUsername(formData.username, newErrors, userType)

    if (!formData.firstName.trim()) newErrors.firstName = "El nombre es requerido"
    else if (formData.firstName.length < 2) newErrors.firstName = "Mínimo 2 caracteres"

    if (!formData.lastName.trim()) newErrors.lastName = "El apellido es requerido"
    else if (formData.lastName.length < 2) newErrors.lastName = "Mínimo 2 caracteres"

    if (!formData.email.trim()) newErrors.email = "El email es requerido"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email inválido"

    if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido"
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "La fecha de nacimiento es requerida"

    const pwdValidation = AuthService.validatePassword(formData.password)
    if (!pwdValidation.valid) newErrors.password = pwdValidation.message ?? "Contraseña inválida"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden"

    if (userType === UserTypeEnum.TRAINER) {
      if (!formData.specialty.trim()) newErrors.specialty = "La especialidad es requerida"
      else if (formData.specialty.length < 3) newErrors.specialty = "Mínimo 3 caracteres"

      const certs = formData.certificationsText.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      if (certs.length === 0) newErrors.certificationsText = "Al menos una certificación"
      else if (certs.length > 10) newErrors.certificationsText = "Máximo 10 certificaciones"

      const rate = parseFloat(formData.hourlyRate)
      if (!formData.hourlyRate.trim()) newErrors.hourlyRate = "La tarifa es requerida"
      else if (isNaN(rate) || rate <= 0) newErrors.hourlyRate = "Tarifa debe ser mayor a 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error("Error de validación", { description: "Corrige los errores en el formulario" })
      return
    }

    setLoading(true)
    try {
      let response

      if (userType === UserTypeEnum.MEMBER) {
        const data: MemberRegistrationData = {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          dateOfBirth: formData.dateOfBirth,
        }
        response = await AuthService.registerMember(data)
      } else {
        const certifications = formData.certificationsText
          .split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
        const data: TrainerRegistrationData = {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          dateOfBirth: formData.dateOfBirth,
          specialty: formData.specialty.trim(),
          certifications,
          hourlyRate: parseFloat(formData.hourlyRate),
        }
        response = await AuthService.registerTrainer(data)
      }

      if (response?.success && response.data?.user) {
        login(response.data.user)
        toast.success("¡Registro exitoso!", { description: "Redirigiendo..." })
        router.push(Paths.DASHBOARD)
      } else {
        toast.error("Error en el registro", { description: response?.error ?? "Intenta de nuevo." })
      }
    } catch {
      toast.error("Error", { description: "Error de conexión. Intenta de nuevo." })
    } finally {
      setLoading(false)
    }
  }

  // ── Render: selector de tipo ───────────────────────────────────────────────
  if (userType === null) {
    return <RegisterTypeSelector onSelect={handleTypeSelect} />
  }

  // ── Render: formulario ─────────────────────────────────────────────────────
  const isMember = userType === UserTypeEnum.MEMBER

  // Slices de formData tipados para los sub-componentes
  const memberData: MemberFieldsData = { phone: formData.phone, dateOfBirth: formData.dateOfBirth }
  const trainerData = {
    phone: formData.phone,
    dateOfBirth: formData.dateOfBirth,
    specialty: formData.specialty,
    certificationsText: formData.certificationsText,
    hourlyRate: formData.hourlyRate,
  }

  return (
    <Card className="w-full max-w-2xl p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {isMember ? <User className="h-6 w-6" /> : <Dumbbell className="h-6 w-6" />}
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              Registro de {isMember ? "Atleta" : "Entrenador"}
            </h2>
            <p className="text-sm text-muted-foreground">Completa tus datos</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => handleTypeSelect(null)}>
          Cambiar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <InputGroup className={cn(errors.username && "border-destructive ring-destructive/20")}>
              <InputGroupAddon align="inline-start">
                <InputGroupText><User className="size-4" /></InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="username" name="username" placeholder="juan_doe"
                value={formData.username} onChange={handleChange}
              />
            </InputGroup>
            {errors.username && <FieldError message={errors.username} />}
          </div>

          {/* Nombre + Apellido */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <InputGroup className={cn(errors.firstName && "border-destructive ring-destructive/20")}>
                <InputGroupAddon align="inline-start">
                  <InputGroupText><User className="size-4" /></InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="firstName" name="firstName" placeholder="Juan"
                  value={formData.firstName} onChange={handleChange}
                />
              </InputGroup>
              {errors.firstName && <FieldError message={errors.firstName} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <InputGroup className={cn(errors.lastName && "border-destructive ring-destructive/20")}>
                <InputGroupAddon align="inline-start">
                  <InputGroupText><User className="size-4" /></InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="lastName" name="lastName" placeholder="Pérez"
                  value={formData.lastName} onChange={handleChange}
                />
              </InputGroup>
              {errors.lastName && <FieldError message={errors.lastName} />}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <InputGroup className={cn(errors.email && "border-destructive ring-destructive/20")}>
              <InputGroupAddon align="inline-start">
                <InputGroupText><Mail className="size-4" /></InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="email" name="email" type="email" placeholder="juan@ejemplo.com"
                value={formData.email} onChange={handleChange}
              />
            </InputGroup>
            {errors.email && <FieldError message={errors.email} />}
          </div>

          {/* Contraseñas */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <InputGroup className={cn(errors.password && "border-destructive ring-destructive/20")}>
                <InputGroupAddon align="inline-start">
                  <InputGroupText><Lock className="size-4" /></InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="password" name="password" type="password"
                  placeholder="Mín. 8 caracteres"
                  value={formData.password} onChange={handleChange}
                />
              </InputGroup>
              {errors.password && <FieldError message={errors.password} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <InputGroup className={cn(errors.confirmPassword && "border-destructive ring-destructive/20")}>
                <InputGroupAddon align="inline-start">
                  <InputGroupText><Lock className="size-4" /></InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="confirmPassword" name="confirmPassword" type="password"
                  placeholder="Repetir contraseña"
                  value={formData.confirmPassword} onChange={handleChange}
                />
              </InputGroup>
              {errors.confirmPassword && <FieldError message={errors.confirmPassword} />}
            </div>
          </div>

          {/* Campos específicos por tipo */}
          {isMember ? (
            <MemberFields
              data={memberData}
              errors={{ phone: errors.phone, dateOfBirth: errors.dateOfBirth }}
              onChange={handleChange}
            />
          ) : (
            <TrainerFields
              data={trainerData}
              errors={{
                phone: errors.phone,
                dateOfBirth: errors.dateOfBirth,
                specialty: errors.specialty,
                certificationsText: errors.certificationsText,
                hourlyRate: errors.hourlyRate,
              }}
              onChange={handleChange}
            />
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Inicia sesión
        </Link>
      </div>
    </Card>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1 text-xs text-destructive">
      <AlertCircle className="h-3 w-3" />
      {message}
    </p>
  )
}