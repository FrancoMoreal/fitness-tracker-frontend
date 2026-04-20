"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
interface NavbarClientProps {
  initialUser: {
    username: string
    email?: string
  } | null
}

function getUserInitials(username: string): string {
  return username
    .replace(/_/g, " ")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function NavbarClient({ initialUser }: NavbarClientProps) {
  const { logout } = useAuth()

  if (!initialUser) {
    return (
      <div className="flex items-center gap-2">
         <ThemeToggle />
        <Link href="/login">
          <Button variant="ghost" size="sm" className="h-9 px-4">
            Iniciar sesión
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm" className="h-9 px-4">
            Registrarse
          </Button>
        </Link>
      </div>
    )
  }

  return (
      <div className="flex items-center gap-2">
         <ThemeToggle />
    <Button asChild variant="ghost" size="sm" className="h-9 px-4">
      <Link href="/dashboard">Dashboard</Link>
    </Button>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar className="h-9 w-9 after:hidden shadow-none">
            <AvatarImage src={undefined} alt={initialUser.username} />
            <AvatarFallback className="bg-primary/10 text-sm font-medium shadow-none">
              {getUserInitials(initialUser.username)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{initialUser.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {initialUser.email ?? "—"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
      </div>
  )
}