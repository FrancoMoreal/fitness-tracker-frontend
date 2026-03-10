import Link from "next/link"
import { cookies } from "next/headers"
import { NavbarClient } from "@/components/layouts/navbar-client"
import { cn } from "@/lib/utils"

const COOKIE_NAME = "fitness_tracker_token"


 // Solo se usa para leer claims en el servidor — la firma se valida en el backend.

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const base64  = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const padded  = base64 + "=".repeat((4 - (base64.length % 4)) % 4)
    const decoded = Buffer.from(padded, "base64").toString("utf-8")
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

function isTokenExpired(payload: Record<string, unknown>): boolean {
  if (typeof payload.exp !== "number") return true
  return Date.now() >= payload.exp * 1000
}

export async function Navbar({ className }: { className?: string }) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  let initialUser: { username: string; email?: string } | null = null

  if (token) {
    const payload = decodeJwtPayload(token)
    if (payload && !isTokenExpired(payload)) {
      initialUser = {
        username: payload.sub as string,
         email: payload.email as string,
      }
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
        className
      )}
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-80"
          aria-label="Fitness Tracker - Inicio"
        >
          <span className="text-lg font-semibold tracking-tight">
            Fitness Tracker
          </span>
        </Link>

        {/* Navegación — delega interacciones al client component */}
        <nav className="flex items-center gap-2" aria-label="Navegación principal">
          <NavbarClient initialUser={initialUser} />
        </nav>
      </div>
    </header>
  )
}