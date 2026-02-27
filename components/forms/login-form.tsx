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
import { useAuth } from "@/lib/auth-context"
import { AuthService } from "@/services/auth.service"
import { Paths } from "@/lib/paths"

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
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
      const response = await AuthService.login({ username, password })

      if (!response.success) {
        setError(response.error || "Error al iniciar sesión.")
        return
      }

      const authData = response.data

      if (!authData?.token || !authData?.user) {
        setError("Respuesta inválida del servidor.")
        return
      }

      console.log("[Login] Login exitoso", {
        username: authData.user.username,
        userId: authData.user.id,
        role: authData.user.role,
      })

      // login() actualiza el contexto
      AuthService.saveToken(authData.token)
      AuthService.saveUser(authData.user)
      login(authData.user)

      router.push(Paths.HOME)

    } catch (err) {
      console.error(err)
      setError(
        err instanceof Error
          ? err.message
          : "Error al iniciar sesión. Revisá usuario y contraseña."
      )
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