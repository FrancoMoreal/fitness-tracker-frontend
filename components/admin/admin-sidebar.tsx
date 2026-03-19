"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Dumbbell, UserCheck, UserX } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { label: "Panel",       href: "/admin",           icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Usuarios",    href: "/admin/users",      icon: <Users className="h-4 w-4" />          },
  { label: "Miembros",    href: "/admin/members",    icon: <UserCheck className="h-4 w-4" />      },
  { label: "Trainers",    href: "/admin/trainers",   icon: <UserCheck className="h-4 w-4" />      },
  { label: "Ejercicios",  href: "/admin/exercises",  icon: <Dumbbell className="h-4 w-4" />       },
  { label: "Eliminados",  href: "/admin/deleted",    icon: <UserX className="h-4 w-4" />          },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive text-destructive-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <div>
            <span className="text-sm font-semibold">Panel Admin</span>
            <p className="text-xs text-muted-foreground">Administración</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Gestión
        </p>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              isActive(item.href)
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span className={cn(
              isActive(item.href) ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
            )}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}