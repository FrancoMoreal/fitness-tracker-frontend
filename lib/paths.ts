
export const Paths = {
    HOME:     "/",
    LOGIN:    "/login",
    REGISTER: "/register",
    PROFILE:  "/profile",
    DASHBOARD: "/dashboard",
  } as const
  
  export type AppPath = typeof Paths[keyof typeof Paths]