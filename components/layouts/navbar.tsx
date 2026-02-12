"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  return (
    <header
      className={cn(
        "absolute top-0 z-50 w-full transition-colors",
        "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg outline-none ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          aria-label="Fitness Tracker - Inicio"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="size-5" aria-hidden />
          </span>
        </Link>

        <nav
          className="flex items-center gap-1"
          aria-label="Navegación principal"
        >
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/15 hover:text-white"
            >
              Iniciar sesión
            </Button>
          </Link>
          <Separator
            orientation="vertical"
            className="h-5 bg-white/30 data-[orientation=vertical]:w-px"
          />
          <Link href="/register">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Registrarse
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
