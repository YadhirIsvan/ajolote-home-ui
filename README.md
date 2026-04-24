# Avakanta — Frontend
  
SPA React para la plataforma inmobiliaria Avakanta.

## Stack

- React 18 · TypeScript 5 · Vite 5
- Tailwind CSS 3 · shadcn/ui (Radix UI)
- TanStack Query v5 · React Hook Form · Zod
- React Router DOM v7
- Axios para peticiones HTTP

## Requisitos previos

- Node.js 20+

## Setup local

```bash
# 1. Variables de entorno
cp .env.example .env
# Editar VITE_API_BASE_URL con la URL del backend local

# 2. Instalar dependencias
npm ci

# 3. Servidor de desarrollo
npm run dev
# App en http://localhost:8080
```

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `VITE_API_BASE_URL` | URL base del backend (e.g. `http://localhost:8000/api/v1`) |
| `VITE_GOOGLE_CLIENT_ID` | Client ID de Google OAuth |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon key de Supabase (pública) |
| `VITE_SUPABASE_PROJECT_ID` | ID del proyecto Supabase |

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run typecheck` | Verificación de tipos TypeScript |
| `npm run lint` | Linting con ESLint |
| `npm run test` | Tests en modo watch |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run preview` | Preview del build de producción |

## Tests

```bash
npm run test             # modo watch (desarrollo)
npm run test:coverage    # cobertura mínima: lines 80%, functions 80%, branches 75%
```

## Build de producción

```bash
npm run typecheck   # verificar tipos sin errores
npm run build       # genera dist/
```

El build aplica automáticamente:
- Eliminación de `console.*` y `debugger`
- Code splitting por ruta (lazy loading)
- Minificación con esbuild

## Deploy

El frontend se despliega en **Vercel**. La configuración está en `vercel.json`:
- Rewrite de SPA (todas las rutas a `index.html`)
- Headers de seguridad: CSP, X-Frame-Options, Referrer-Policy

## Estructura

```
src/
├── auth/           # OTP, Google OAuth, modal de autenticación
├── buy/            # búsqueda, filtros, detalle de propiedad
├── home/           # landing page, servicios
├── sell/           # formulario de vendedor
├── myAccount/      # panel admin, agente y cliente
├── notifications/  # sistema de notificaciones
├── shared/
│   ├── api/        # cliente Axios configurado
│   ├── components/ # componentes reutilizables y UI (shadcn)
│   └── hooks/      # AuthProvider, contextos globales
└── router/         # rutas de la app con lazy loading
```
