

const KEYS = {
  USER: "fitness_tracker_user",
} as const

// Guard SSR — localStorage no existe en el servidor
const isBrowser = typeof window !== "undefined"

export const storage = {
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


  clearSession(): void {
    this.removeUser()
  },
}