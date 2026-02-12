// Tipos alineados con el backend: RegisterMemberDTO y RegisterTrainerDTO

export type UserType = "member" | "trainer"

export interface MemberRegistrationData {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  dateOfBirth: string // YYYY-MM-DD
}

export interface TrainerRegistrationData {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  specialty: string
  certifications: string[] // al menos una
  hourlyRate: number
}

export type RegistrationData = MemberRegistrationData | TrainerRegistrationData
