"use client"

import { Label } from "@/components/ui/label"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { AlertCircle, Phone, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MemberFieldsData {
  phone: string
  dateOfBirth: string
}

interface MemberFieldsProps {
  data: MemberFieldsData
  errors: Partial<Record<keyof MemberFieldsData, string>>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
export function MemberFields({ data, errors, onChange }: MemberFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Teléfono */}
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

      {/* Fecha de nacimiento */}
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
  )
}