import { NextRequest, NextResponse } from "next/server"

const COOKIE_NAME = "fitness_tracker_token"

// Rutas que no requieren autenticación
const PUBLIC_PATHS = ["/login", "/register"]


const MEMBER_PREFIX  = "/member"
const TRAINER_PREFIX = "/trainer"


function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    // El payload es la segunda parte, codificada en base64url
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    // Padding necesario para que atob funcione correctamente
    const padded  = base64 + "=".repeat((4 - (base64.length % 4)) % 4)
    const decoded = atob(padded)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

function isTokenExpired(payload: Record<string, unknown>): boolean {
  if (typeof payload.exp !== "number") return true
  return Date.now() >= payload.exp * 1000
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Dejar pasar rutas públicas sin ninguna verificación
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  if (isPublic) return NextResponse.next()

  // Leer la cookie HttpOnly
  const token = request.cookies.get(COOKIE_NAME)?.value

  // Sin token → login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Decodificar payload
  const payload = decodeJwtPayload(token)

  // Token malformado o expirado → login
  if (!payload || isTokenExpired(payload)) {
    const response = NextResponse.redirect(new URL("/login", request.url))
    // Limpiar la cookie expirada para no entrar en loop
    response.cookies.delete(COOKIE_NAME)
    return response
  }

  const userType = payload.userType as string | undefined

  // Protección cruzada: MEMBER no puede entrar a rutas de TRAINER y viceversa
  if (pathname.startsWith(TRAINER_PREFIX) && userType !== "TRAINER") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (pathname.startsWith(MEMBER_PREFIX) && userType !== "MEMBER") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}


 // Definir en qué rutas actúa el middleware.

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}