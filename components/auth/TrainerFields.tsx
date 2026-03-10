"use client"

import { Label } from "@/components/ui/label"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { AlertCircle, Award, FileText, DollarSign, Phone, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TrainerFieldsData {
  phone: string
  dateOfBirth: string
  specialty: string
  certificationsText: string
  hourlyRate: string
}

interface TrainerFieldsProps {
  data: TrainerFieldsData
  errors: Partial<Record<keyof TrainerFieldsData, string>>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function TrainerFields({ data, errors, onChange }: TrainerFieldsProps) {
  return (
    <>
      {/* Teléfono + Fecha de nacimiento */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <InputGroup className={cn(errors.phone && "border-destructive ring-destructive/20")}>
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
              value={data.phone}
              onChange={onChange}
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
          <InputGroup className={cn(errors.dateOfBirth && "border-destructive ring-destructive/20")}>
            <InputGroupAddon align="inline-start">
              <InputGroupText>
                <Calendar className="size-4" />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={data.dateOfBirth}
              onChange={onChange}
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

      {/* Sección profesional */}
      <div className="space-y-4 rounded-lg border bg-muted/30 p-6">
        <h3 className="font-semibold">Información profesional</h3>

        {/* Especialidad */}
        <div className="space-y-2">
          <Label htmlFor="specialty">Especialidad</Label>
          <InputGroup className={cn(errors.specialty && "border-destructive ring-destructive/20")}>
            <InputGroupAddon align="inline-start">
              <InputGroupText>
                <Award className="size-4" />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="specialty"
              name="specialty"
              placeholder="Ej. Fuerza y acondicionamiento"
              value={data.specialty}
              onChange={onChange}
            />
          </InputGroup>
          {errors.specialty && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              {errors.specialty}
            </p>
          )}
        </div>

        {/* Certificaciones */}
        <div className="space-y-2">
          <Label htmlFor="certificationsText">
            Certificaciones (una por línea o separadas por coma)
          </Label>
          <InputGroup
            className={cn(
              "h-auto min-h-20",
              errors.certificationsText && "border-destructive ring-destructive/20",
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
              placeholder={"NSCA-CPT\nACE"}
              rows={3}
              className="min-h-20 resize-none"
              value={data.certificationsText}
              onChange={onChange}
            />
          </InputGroup>
          {errors.certificationsText && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              {errors.certificationsText}
            </p>
          )}
        </div>

        {/* Tarifa horaria */}
        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Tarifa horaria</Label>
          <InputGroup className={cn(errors.hourlyRate && "border-destructive ring-destructive/20")}>
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
              value={data.hourlyRate}
              onChange={onChange}
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
    </>
  )
}