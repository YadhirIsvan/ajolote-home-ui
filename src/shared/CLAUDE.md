# CLAUDE.md — src/shared/
## Núcleo Global Compartido

> Claude Code carga este archivo automáticamente al trabajar en `src/shared/`.

---

## PROPÓSITO

`src/shared/` es el **núcleo global del proyecto**. Contiene todo el código que
es genuinamente reutilizable por 2 o más dominios de primer nivel
(`home/`, `buy/`, `sell/`, `auth/`, `myAccount/`).

**Regla de ingreso:** Un archivo entra a `shared/` solo cuando es realmente usado
por 2 o más dominios. No muevas código aquí "por si acaso".

---

## ESTRUCTURA INTERNA

```
src/shared/
├── api/
│   └── axios.instance.ts     ← Instancia BASE de Axios. Todos los dominios la extienden.
├── actions/
│   └── *.actions.ts          ← Actions usadas por 2+ dominios
├── types/
│   └── index.ts              ← Interfaces y types globales
├── hooks/
│   └── use-*.hook.ts         ← Custom hooks globales
└── components/
    ├── ui/                   ← Componentes de Shadcn (ÚNICO almacén)
    └── custom/               ← Componentes genéricos reutilizables
        ├── Loading.tsx
        ├── ErrorMessage.tsx
        ├── PublicLayout.tsx
        ├── AuthLayout.tsx
        └── ...
```

---

## src/shared/api/ — La Instancia Base

### Responsabilidades (y solo estas)
1. Crear la instancia base de Axios con `baseURL` y `timeout` desde variables de entorno.
2. Interceptor de **request**: adjuntar token de autenticación.
3. Interceptor de **response**: manejar errores globales (401, 500, network errors).

### Reglas
- Esta instancia es la **única** que puede tener interceptors globales.
- Los dominios la importan y la re-exportan (o crean instancias derivadas con `axios.create`).
- **Nunca** agregues lógica de dominio específico aquí.
- **Nunca** importes desde dominios específicos en este archivo.

```typescript
// ✅ Correcto — cómo un dominio usa la instancia base
import { axiosInstance } from '@/shared/api/axios.instance';
export const buyApi = axiosInstance;

// ❌ Incorrecto — usar axios directamente en el dominio
import axios from 'axios';
const buyApi = axios.create({ baseURL: '...' }); // ← omite interceptors globales
```

---

## src/shared/components/ui/ — Shadcn

- Es el **único** lugar del proyecto donde existen componentes de Shadcn.
- **Nunca** copies ni recrees componentes de Shadcn en otros directorios.
- Cuando necesites extender un componente Shadcn → crea un wrapper en `custom/`.

---

## src/shared/components/custom/ — Componentes Genéricos

### Criterio de entrada
Un componente entra aquí si:
- Es usado por 2+ dominios distintos, Y
- No contiene lógica específica de ningún dominio.

### Componentes obligatorios del proyecto
```tsx
Loading.tsx       ← Usado por Suspense en el router. Sin props requeridas.
ErrorMessage.tsx  ← Mensaje de error genérico. Props: { message?: string }
PublicLayout.tsx  ← Layout de rutas públicas (header + outlet + footer)
AuthLayout.tsx    ← Layout para páginas de login/registro
```

### Reglas
- Sin lógica de dominio específico.
- Sin imports desde `home/`, `buy/`, `sell/`, `auth/`, `myAccount/`.
- Props tipadas y exportadas.

---

## src/shared/types/ — Types Globales

Aquí viven types usados por 2+ dominios:

```typescript
// Ejemplos de types que pertenecen a shared:
export interface PaginationMeta {
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

export type UserRole = 'client' | 'agent' | 'admin';
```

---

## src/shared/hooks/ — Hooks Globales

Hooks usados por 2+ dominios. Ejemplos típicos:

```
use-pagination.hook.ts        ← Lógica de paginación genérica
use-debounce.hook.ts          ← Debounce para inputs de búsqueda
use-local-storage.hook.ts     ← Abstracción de localStorage tipada
use-window-size.hook.ts       ← Responsive breakpoints
```

---

## PROHIBICIONES

- ❌ Código específico de un solo dominio en `shared/`.
- ❌ Imports desde dominios específicos (`buy/`, `sell/`, etc.).
- ❌ Lógica de negocio de dominio en componentes de `shared/components/custom/`.
- ❌ Interceptors de negocio en `shared/api/axios.instance.ts`.
- ❌ Componentes de Shadcn fuera de `shared/components/ui/`.
