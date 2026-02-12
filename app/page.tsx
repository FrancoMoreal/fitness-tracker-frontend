import { Navbar } from "@/components/layouts/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-muted/30">
      <Navbar />

      <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4 text-center">
        <div className="container max-w-[720px] space-y-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Domina tu{" "}
            <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text font-extrabold text-transparent">
              potencial
            </span>
          </h1>

          <p className="mx-auto max-w-[540px] text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            La plataforma definitiva para gestionar tus entrenamientos,
            seguir tus progresos y alcanzar tus metas fitness.
          </p>
        </div>
      </main>
    </div>
  )
}
