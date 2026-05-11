"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Users,
  User,
  UserCheck,
  ClipboardList,
  Settings,
  History
} from "lucide-react"
import { cn } from "@/lib/utils"

export type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
}

interface SidebarClientProps {
  navItems: NavItem[]
  username: string
  userType: string
}


export const NAV_ICONS: Record<string, React.ReactNode> = {
  dashboard:  <LayoutDashboard className="h-4 w-4" />,
  routines:   <Dumbbell className="h-4 w-4" />,
  nutrition:  <Utensils className="h-4 w-4" />,
  members:    <Users className="h-4 w-4" />,
  profile:    <User className="h-4 w-4" />,
  settings:   <Settings className="h-4 w-4" />,
  myTrainer:  <UserCheck className="h-4 w-4" />,
  exercises:  <ClipboardList className="h-4 w-4" />,
  history:    <History className="h-4 w-4" />,
}


export function SidebarClient({ navItems, username, userType }: SidebarClientProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      {/* Header del sidebar */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Dumbbell className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">Fitness Tracker</span>
            <span className="mt-1 text-xs text-muted-foreground capitalize">
              {userType === "TRAINER" ? "Entrenador" : "Atleta"}
            </span>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Menú
        </p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
              isActive(item.href)
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "transition-colors",
                isActive(item.href)
                  ? "text-primary-foreground"
                  : "text-muted-foreground group-hover:text-foreground"
              )}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer del sidebar */}
      <div className="border-t px-3 py-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {username.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">{username}</span>
            <span className="mt-1 text-xs text-muted-foreground">
              {userType === "TRAINER" ? "Entrenador" : "Atleta"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}