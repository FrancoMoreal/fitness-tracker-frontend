# Fitness Tracker – Frontend

Aplicación web para la gestión de entrenamientos entre **entrenadores** y **alumnos**.

Diseñada como MVP escalable con arquitectura modular y separación clara de responsabilidades.

---

## 🚀 Descripción

**Fitness Tracker** permite:

- Registro con roles: `MEMBER` (Alumno) y `TRAINER` (Entrenador)
- Autenticación JWT
- Solicitudes de vinculación alumno → entrenador
- Gestión futura de rutinas y planes alimenticios
- Base preparada para escalar a administración de gimnasios

El backend es propio y se encuentra en un repositorio separado.

---

## 🧱 Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **JWT Authentication**
- Arquitectura basada en Services + API Client centralizado

## 🏗 Arquitectura

Estructura principal:

```
frontend/
│
├── app/                → Rutas (App Router)
│   ├── (auth)/login
│   ├── register
│   ├── profile
│   ├── settings
│   └── (dashboard)
│
├── components/         → Componentes reutilizables
│   ├── forms/
│   ├── layouts/
│   └── ui/
│
├── services/           → Lógica de negocio (AuthService, etc.)
├── lib/
│   ├── api-client.ts   → Cliente HTTP centralizado
│   └── auth-context.tsx
│
├── hooks/
├── types/
├── constants/
└── store/
```

### Principios aplicados

- Separación de responsabilidades (UI ≠ lógica ≠ comunicación HTTP)
- Cliente HTTP centralizado
- Tipado fuerte con TypeScript
- Manejo de roles basado en Enum
- Arquitectura preparada para escalabilidad

## 🔐 Autenticación

- JWT emitido por backend
- Manejo de sesión en `AuthContext`
- Header `Authorization` agregado automáticamente por `api-client`
- Sistema de roles:
    - `MEMBER`
    - `TRAINER`

---

## 👥 Roles del sistema

### 🧑 Alumno (MEMBER)

- Registro y autenticación
- Visualización de entrenadores
- Envío de solicitud de vinculación
- Acceso a rutinas asignadas (en desarrollo)

### 🧑‍🏫 Entrenador (TRAINER)

- Registro y autenticación
- Gestión de solicitudes de alumnos
- Asignación de rutinas y planes (en desarrollo)

---

## ⚙️ Instalación y ejecución

```
git clone https://github.com/tu-usuario/fitness-tracker-frontend.git
cd fitness-tracker/frontend
npm install
npm run dev
```

La aplicación se ejecutará en:

```
http://localhost:3000
```

---

## 🌎 Variables de entorno

Crear un archivo `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 🔌 Integración con Backend

El frontend consume una API REST propia.

El backend:

- Maneja autenticación
- Lógica de solicitudes
- Gestión de relaciones entrenador-alumno
- Emisión y validación de JWT

---

## 🛣 Roadmap

- [ ]  Dashboard completo para entrenadores
- [ ]  Gestión de rutinas
- [ ]  Planes alimenticios
- [ ]  Sistema de notificaciones
- [ ]  Administración para gimnasios
- [ ]  Deploy en producción

---
