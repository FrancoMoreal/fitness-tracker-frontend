import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Navbar } from "@/components/layouts/navbar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") redirect("/dashboard")

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex md:shrink-0">
          <AdminSidebar />
        </div>
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}