"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { login, TOKEN_KEY } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

export function LoginForm() {
  const router = useRouter()
  const { setAuthenticated, setUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)
    const username = (formData.get("username") as string)?.trim()
    const password = formData.get("password") as string

    if (!username || !password) {
      setError("Usuario y contraseña son requeridos.")
      return
    }

    setIsLoading(true)
    try {
      const response = await login({ username, password })
      if (response.token) {
        console.log("[Login] Login exitoso", {
          username: response.user?.username ?? username,
          userId: response.user?.id,
          role: response.user?.role,
          hasMember: !!response.member,
          hasTrainer: !!response.trainer,
          expiresAt: response.expiresAt,
        })
        if (typeof window !== "undefined") {
          localStorage.setItem(TOKEN_KEY, response.token)
          if (response.user) {
            const u = {
              id: response.user.id,
              username: response.user.username,
              email: response.user.email,
              role: response.user.role,
              enabled: response.user.enabled,
            }
            localStorage.setItem("fitness_tracker_user", JSON.stringify(u))
            setUser(u)
          }
        }
        setAuthenticated(true)
        router.push("/")
        router.refresh()
      } else {
        setError("No se recibió token del servidor.")
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al iniciar sesión. Revisá usuario y contraseña."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-sm border bg-card text-card-foreground shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-semibold">Iniciar sesión</CardTitle>
        <CardDescription>
          Ingresá tu usuario y contraseña para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4" id="login-form">
          {error && (
            <p
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {error}
            </p>
          )}
          <div className="grid gap-2">
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="tu_usuario"
              autoComplete="username"
              required
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión…" : "Iniciar sesión"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 border-t pt-4">
        <p className="text-center text-sm text-muted-foreground">
          ¿No tenés cuenta?{" "}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Registrarse
          </Link>
        </p>
        <Link
          href="/"
          className="text-center text-sm text-muted-foreground hover:text-foreground"
        >
          ← Volver al inicio
        </Link>
      </CardFooter>
    </Card>
  )
}
