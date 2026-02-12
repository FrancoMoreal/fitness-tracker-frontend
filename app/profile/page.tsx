import { Navbar } from "@/components/layouts/navbar"

export default function ProfilePage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />

      <main className="container px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Perfil
        </h1>
        <p className="mt-2 text-muted-foreground">
          Aquí podrás ver y editar tu perfil de usuario.
        </p>
      </main>
    </div>
  )
}
