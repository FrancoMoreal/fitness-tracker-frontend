"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import AuthService from "@/services/auth.service";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { toast } from "sonner";
import {
  User,
  Dumbbell,
  Mail,
  Lock,
  Phone,
  Calendar,
  Award,
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  MemberRegistrationData,
  TrainerRegistrationData,
} from "@/types/register.types";
import registerService from "@/services/auth.service";
import { useAuth } from "@/lib/auth-context";
import { Paths } from "@/lib/paths"

enum UserEnum {
  MEMBER,
  TRAINER,
}

interface FormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dateOfBirth: string;
  specialty: string;
  certificationsText: string;
  hourlyRate: string;
}

const initialFormData: FormData = {
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
};

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [userType, setUserTypeState] = useState<UserEnum | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setUserType = (type: UserEnum | null) => {
    console.log("[Register] Cambiando tipo de usuario:", type);
    setUserTypeState(type);
    if (type === null) {
      console.log("[Register] Reseteando formulario");
      setFormData(initialFormData);
      setErrors({});
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    console.log("[Register] Validando formulario", {
      userType,
      formData: { ...formData, password: "***", confirmPassword: "***" },
    });
    const newErrors: Record<string, string> = {};

validateUsername(formData.username, newErrors, userType)

    if (!formData.firstName.trim())
      newErrors.firstName = "El nombre es requerido";
    else if (formData.firstName.length < 2)
      newErrors.firstName = "Mínimo 2 caracteres";

    if (!formData.lastName.trim())
      newErrors.lastName = "El apellido es requerido";
    else if (formData.lastName.length < 2)
      newErrors.lastName = "Mínimo 2 caracteres";

    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email inválido";

    if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido";

    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "La fecha de nacimiento es requerida";

    const pwdValidation = registerService.validatePassword(formData.password);
    if (!pwdValidation.valid) {
      newErrors.password = pwdValidation.message ?? "Contraseña inválida";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (userType === UserEnum.TRAINER) {
      if (!formData.specialty.trim())
        newErrors.specialty = "La especialidad es requerida";
      else if (formData.specialty.length < 3)
        newErrors.specialty = "Mínimo 3 caracteres";

      const certs = formData.certificationsText
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (certs.length === 0) {
        newErrors.certificationsText = "Al menos una certificación";
      } else if (certs.length > 10) {
        newErrors.certificationsText = "Máximo 10 certificaciones";
      }

      const rate = parseFloat(formData.hourlyRate);
      if (!formData.hourlyRate.trim())
        newErrors.hourlyRate = "La tarifa es requerida";
      else if (isNaN(rate) || rate <= 0)
        newErrors.hourlyRate = "Tarifa debe ser mayor a 0";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      console.warn("[Register] Errores de validación:", newErrors);
    } else {
      console.log("[Register] Formulario válido");
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Register] Submit del formulario", { userType });

    if (!validateForm()) {
      console.warn("[Register] Validación fallida, no se envía");
      toast.error("Error de validación", {
        description: "Corrige los errores en el formulario",
      });
      return;
    }

    setLoading(true);
    console.log("[Register] Iniciando registro...");

    try {
      let response;

      if (userType === UserEnum.MEMBER) {
        console.log("[Register] Procesando registro de miembro");
        const data: MemberRegistrationData = {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          dateOfBirth: formData.dateOfBirth,
        };
        response = await AuthService.registerMember(data);
      } else if (userType === UserEnum.TRAINER) {
        console.log("[Register] Procesando registro de entrenador");
        const certifications = formData.certificationsText
          .split(/[\n,]+/)
          .map((s) => s.trim())
          .filter(Boolean);
        console.log("[Register] Certificaciones procesadas:", certifications);

        const data: TrainerRegistrationData = {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          specialty: formData.specialty.trim(),
          certifications,
          hourlyRate: parseFloat(formData.hourlyRate),
        };
        response = await AuthService.registerTrainer(data);
      }

      if (response?.success && response.data?.token && response.data?.user) {
        console.log("[Register] Registro exitoso con token, guardando sesión");

        login(response.data.user); // una sola llamada atómica

        toast.success("¡Registro exitoso!", {
          description: "Redirigiendo al perfil...",
        });
        router.push(Paths.PROFILE);
      } else {
        console.error("[Register] Error en registro:", response?.error);
        toast.error("Error en el registro", {
          description: response?.error ?? "Intenta de nuevo.",
        });
      }
    } catch (err) {
      console.error("[Register] Excepción inesperada:", err);
      toast.error("Error", {
        description: "Error de conexión. Intenta de nuevo.",
      });
    } finally {
      setLoading(false);
      console.log("[Register] Finalizado proceso de registro");
    }
  };

  const benefits = {
    member: [
      "Acceso a rutinas personalizadas",
      "Seguimiento de progreso",
      "Biblioteca de ejercicios",
      "Estadísticas de rendimiento",
    ],
    trainer: [
      "Gestión de clientes",
      "Rutinas personalizadas",
      "Dashboard con métricas",
      "Comunicación integrada",
    ],
  };
  const isMember = userType === UserEnum.MEMBER;
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-2 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Únete a Fitness Tracker
          </h1>
          <p className="text-muted-foreground">Elige tu perfil y comienza</p>
        </div>

        {!userType ? (
          <div className="w-full max-w-4xl">
            <div className="grid gap-6 md:grid-cols-2">
              <Card
                className="group relative cursor-pointer overflow-hidden border-2 p-8 transition-all hover:border-primary hover:shadow-xl"
                onClick={() => setUserType(UserEnum.MEMBER)}
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 transition-transform group-hover:scale-150" />
                <div className="relative">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <User className="h-8 w-8" />
                  </div>
                  <h2 className="mb-3 text-2xl font-bold">Soy un Atleta</h2>
                  <p className="mb-6 text-muted-foreground">
                    Rutinas personalizadas y seguimiento de tu entrenamiento
                  </p>
                  <ul className="space-y-3">
                    {benefits.member.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex items-center gap-2 font-medium text-primary">
                    Crear cuenta
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Card>

              <Card
                className="group relative cursor-pointer overflow-hidden border-2 p-8 transition-all hover:border-primary hover:shadow-xl"
                onClick={() => setUserType(UserEnum.TRAINER)}
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 transition-transform group-hover:scale-150" />
                <div className="relative">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Dumbbell className="h-8 w-8" />
                  </div>
                  <h2 className="mb-3 text-2xl font-bold">Soy un Entrenador</h2>
                  <p className="mb-6 text-muted-foreground">
                    Gestiona clientes y crea programas de entrenamiento
                  </p>
                  <ul className="space-y-3">
                    {benefits.trainer.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex items-center gap-2 font-medium text-primary">
                    Crear cuenta
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="w-full max-w-2xl p-8">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {isMember ? (
                    <User className="h-6 w-6" />
                  ) : (
                    <Dumbbell className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    Registro de {isMember ? "Atleta" : "Entrenador"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Completa tus datos
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUserType(null)}
              >
                Cambiar
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Usuario */}
                <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <InputGroup
                    className={cn(
                      errors.username &&
                        "border-destructive ring-destructive/20",
                    )}
                  >
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>
                        <User className="size-4" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="username"
                      name="username"
                      placeholder="juan_doe"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                  {errors.username && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      {errors.username}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <InputGroup
                      className={cn(
                        errors.firstName &&
                          "border-destructive ring-destructive/20",
                      )}
                    >
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>
                          <User className="size-4" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="firstName"
                        name="firstName"
                        placeholder="Juan"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </InputGroup>
                    {errors.firstName && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <InputGroup
                      className={cn(
                        errors.lastName &&
                          "border-destructive ring-destructive/20",
                      )}
                    >
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>
                          <User className="size-4" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="lastName"
                        name="lastName"
                        placeholder="Pérez"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </InputGroup>
                    {errors.lastName && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <InputGroup
                    className={cn(
                      errors.email && "border-destructive ring-destructive/20",
                    )}
                  >
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>
                        <Mail className="size-4" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="email"
                      name="email"
                      type="email"
                      placeholder="juan@ejemplo.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                  {errors.email && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <InputGroup
                      className={cn(
                        errors.phone &&
                          "border-destructive ring-destructive/20",
                      )}
                    >
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>
                          <Phone className="size-4" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+54 9 11 1234-5678"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </InputGroup>
                    {errors.phone && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Fecha de nacimiento</Label>
                    <InputGroup
                      className={cn(
                        errors.dateOfBirth &&
                          "border-destructive ring-destructive/20",
                      )}
                    >
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>
                          <Calendar className="size-4" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                      />
                    </InputGroup>
                    {errors.dateOfBirth && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.dateOfBirth}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <InputGroup
                      className={cn(
                        errors.password &&
                          "border-destructive ring-destructive/20",
                      )}
                    >
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>
                          <Lock className="size-4" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Mín. 8 caracteres, mayúscula, número y @$!%*?&"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </InputGroup>
                    {errors.password && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirmar contraseña
                    </Label>
                    <InputGroup
                      className={cn(
                        errors.confirmPassword &&
                          "border-destructive ring-destructive/20",
                      )}
                    >
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>
                          <Lock className="size-4" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Repetir contraseña"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                    </InputGroup>
                    {errors.confirmPassword && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {userType === UserEnum.TRAINER && (
                <div className="space-y-4 rounded-lg border bg-muted/30 p-6">
                  <h3 className="font-semibold">Información profesional</h3>

                  <div className="space-y-2">
                    <Label htmlFor="specialty">Especialidad</Label>
                    <InputGroup
                      className={cn(
                        errors.specialty &&
                          "border-destructive ring-destructive/20",
                      )}
                    >
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>
                          <Award className="size-4" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="specialty"
                        name="specialty"
                        placeholder="Ej. Fuerza y acondicionamiento"
                        value={formData.specialty}
                        onChange={handleInputChange}
                      />
                    </InputGroup>
                    {errors.specialty && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.specialty}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certificationsText">
                      Certificaciones (una por línea o separadas por coma)
                    </Label>
                    <InputGroup
                      className={cn(
                        "h-auto min-h-[80px]",
                        errors.certificationsText &&
                          "border-destructive ring-destructive/20",
                      )}
                    >
                      <InputGroupAddon align="block-start">
                        <InputGroupText>
                          <FileText className="size-4" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupTextarea
                        id="certificationsText"
                        name="certificationsText"
                        placeholder="NSCA-CPT&#10;ACE"
                        rows={3}
                        className="min-h-[80px] resize-none"
                        value={formData.certificationsText}
                        onChange={handleInputChange}
                      />
                    </InputGroup>
                    {errors.certificationsText && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.certificationsText}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Tarifa horaria</Label>
                    <InputGroup
                      className={cn(
                        errors.hourlyRate &&
                          "border-destructive ring-destructive/20",
                      )}
                    >
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>
                          <DollarSign className="size-4" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="hourlyRate"
                        name="hourlyRate"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="25.00"
                        value={formData.hourlyRate}
                        onChange={handleInputChange}
                      />
                    </InputGroup>
                    {errors.hourlyRate && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.hourlyRate}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Inicia sesión
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function validateUsername(
  username: string,
  newErrors: Record<string, string>,
  userType: UserEnum | null,
) {
  if (!username.trim()) {
    newErrors.username = "El usuario es requerido";
  } else if (username.length < 3 || username.length > 50) {
    newErrors.username = "Entre 3 y 50 caracteres";
  } else if (
    userType === UserEnum.TRAINER &&
    !/^[a-zA-Z0-9_-]+$/.test(username)
  ) {
    newErrors.username = "Solo letras, números, guión y guión bajo";
  }
}
