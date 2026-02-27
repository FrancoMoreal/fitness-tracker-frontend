const KEYS = {
    TOKEN: "fitness_tracker_token",
    USER:  "fitness_tracker_user",
  } as const
  
  // Guard SSR — localStorage no existe en el servidor
  const isBrowser = typeof window !== "undefined"
  
  // TOKEN
  export const storage = {
    getToken(): string | null {
      if (!isBrowser) return null
      return localStorage.getItem(KEYS.TOKEN)
    },
  
    setToken(token: string): void {
      if (!isBrowser) return
      localStorage.setItem(KEYS.TOKEN, token)
    },
  
    removeToken(): void {
      if (!isBrowser) return
      localStorage.removeItem(KEYS.TOKEN)
    },
  
    // USER
    getUser<T>(): T | null {
      if (!isBrowser) return null
      try {
        const raw = localStorage.getItem(KEYS.USER)
        return raw ? (JSON.parse(raw) as T) : null
      } catch {
        return null
      }
    },
  
    setUser<T>(user: T): void {
      if (!isBrowser) return
      localStorage.setItem(KEYS.USER, JSON.stringify(user))
    },
  
    removeUser(): void {
      if (!isBrowser) return
      localStorage.removeItem(KEYS.USER)
    },
  
    // Limpia toda la sesión de una vez
    clearSession(): void {
      this.removeToken()
      this.removeUser()
    },
  }