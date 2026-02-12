import Image from "next/image"
import { Navbar } from "@/components/layouts/navbar"

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full">
      <Navbar />

      <div className="absolute inset-0 -z-10">
        <Image
          src="/fondo-gym.jpg"
          alt="Gimnasio"
          fill
          priority
          className="object-cover brightness-[0.4]"
          sizes="100vw"
        />
      </div>

      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="container max-w-[720px] space-y-8">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-5xl md:text-6xl lg:text-7xl">
            Domina tu{" "}
            <span className="bg-linear-to-r from-primary to-white bg-clip-text font-extrabold text-transparent">
              potencial
            </span>
          </h1>

          <p className="mx-auto max-w-[540px] text-base leading-relaxed text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] sm:text-lg md:text-xl">
            La plataforma definitiva para gestionar tus entrenamientos,
            seguir tus progresos y alcanzar tus metas fitness.
          </p>
        </div>
      </main>
    </div>
  )
}