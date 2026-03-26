import { Navbar } from "@/components/layouts/navbar"
import { Button } from "@/components/ui/button"
import { Dumbbell, ChevronRight, Zap, Users, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Navbar />

      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/5" />
        <div className="absolute -bottom-20 -left-20 h-[350px] w-[350px] rounded-full bg-primary/5" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Hero */}
      <main className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl space-y-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Gestión fitness profesional
          </div>

          {/* Título */}
          <div className="space-y-3">
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Alcanzá tu{" "}
              <span className="relative">
                <span className="relative z-10 text-primary">potencial</span>
                <span className="absolute bottom-1 left-0 z-0 h-3 w-full bg-primary/15" />
              </span>
            </h1>
            <p className="mx-auto max-w-lg text-lg leading-relaxed text-muted-foreground">
              La plataforma que conecta miembros y entrenadores para gestionar
              rutinas, nutrición y progreso en un solo lugar.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gap-2 px-8">
              <Link href="/register">
                Empezar ahora
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8">
              <Link href="/login">Ya tengo cuenta</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
            {[
              {
                icon: <Dumbbell className="h-5 w-5 text-primary" />,
                title: "Rutinas personalizadas",
                desc:  "Tu entrenador diseña planes adaptados a tus objetivos.",
              },
              {
                icon: <Users className="h-5 w-5 text-primary" />,
                title: "Conectate con trainers",
                desc:  "Encontrá el entrenador ideal y comenzá tu transformación.",
              },
              {
                icon: <BarChart3 className="h-5 w-5 text-primary" />,
                title: "Seguí tu progreso",
                desc:  "Registrá workouts y visualizá tus avances en tiempo real.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border bg-card p-5 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  {f.icon}
                </div>
                <p className="mb-1 font-semibold">{f.title}</p>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}