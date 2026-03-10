import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Navbar } from "@/components/layouts/navbar"
import { Sidebar } from "@/components/layouts/sidebar"

/**
 * Layout del grupo (dashboard).
 * - Verifica sesión server-side → redirige a /login si no hay
 * - Renderiza Navbar arriba + Sidebar lateral + área de contenido
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

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar top — sticky, full width */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar lateral — fijo, debajo de la navbar */}
        <div className="hidden md:flex md:shrink-0">
          <Sidebar />
        </div>

        {/* Área de contenido principal */}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}