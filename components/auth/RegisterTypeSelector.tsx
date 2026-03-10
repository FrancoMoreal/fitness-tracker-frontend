"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, ArrowRight, User, Dumbbell } from "lucide-react"

export enum UserTypeEnum {
  MEMBER = 0,
  TRAINER = 1,
}

const BENEFITS = {
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
}

interface RegisterTypeSelectorProps {
  onSelect: (type: UserTypeEnum) => void
}

export function RegisterTypeSelector({ onSelect }: RegisterTypeSelectorProps) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mx-auto grid w-full max-w-2xl gap-6 md:grid-cols-2">
        <TypeCard
          icon={<User className="h-8 w-8" />}
          title="Soy un Atleta"
          description="Rutinas personalizadas y seguimiento de tu entrenamiento"
          benefits={BENEFITS.member}
          onClick={() => onSelect(UserTypeEnum.MEMBER)}
        />
        <TypeCard
          icon={<Dumbbell className="h-8 w-8" />}
          title="Soy un Entrenador"
          description="Gestiona clientes y crea programas de entrenamiento"
          benefits={BENEFITS.trainer}
          onClick={() => onSelect(UserTypeEnum.TRAINER)}
        />
      </div>
    </div>
  )
}

interface TypeCardProps {
  icon: React.ReactNode
  title: string
  description: string
  benefits: string[]
  onClick: () => void
}

function TypeCard({ icon, title, description, benefits, onClick }: TypeCardProps) {
  return (
    <Card
      className="group relative cursor-pointer overflow-hidden border-2 p-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary/5 hover:ring-2 hover:ring-primary/40 hover:shadow-2xl hover:shadow-primary/30"
      onClick={onClick}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 transition-transform group-hover:scale-150" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative pl-12 pr-10 pt-8 pb-12">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
          {icon}
        </div>
        <h2 className="mb-3 text-2xl font-bold">{title}</h2>
        <p className="mb-6 text-muted-foreground">{description}</p>
        <ul className="space-y-3">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm">{benefit}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex items-center gap-2 font-medium text-primary">
          Crear cuenta
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Card>
  )
}