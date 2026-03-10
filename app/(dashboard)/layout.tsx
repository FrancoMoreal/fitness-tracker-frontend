import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"

/**
 * Layout del grupo (dashboard).
 * Primera línea de defensa server-side:
 * - Sin sesión → /login
 * - Con sesión → renderiza children
 *
 * La protección por userType (MEMBER vs TRAINER) la hace cada sub-layout.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return <>{children}</>
}