# CLAUDE.md — src/myAccount/
## Bounded Context: Mi Cuenta

> Claude Code carga este archivo automáticamente al trabajar en `src/myAccount/`.

---

## CONCEPTO FUNDAMENTAL

`myAccount/` es un **Bounded Context** — un dominio complejo que contiene múltiples
sub-dominios organizados por **rol de usuario**. Funciona como un mini-proyecto
dentro del proyecto principal.

```
myAccount/
├── shared/       ← Lógica común entre client, agent y admin
├── client/       ← Experiencia exclusiva del Cliente
├── agent/        ← Experiencia exclusiva del Agente inmobiliario
├── admin/        ← Experiencia exclusiva del Administrador
└── router/       ← Distribuye por rol con my-account.router.tsx
```

---

## JERARQUÍA DE IMPORTS (Irrompible)

```
myAccount/client/   →  myAccount/shared/  →  src/shared/  →  node_modules
myAccount/agent/    →  myAccount/shared/  →  src/shared/  →  node_modules
myAccount/admin/    →  myAccount/shared/  →  src/shared/  →  node_modules
```

**Reglas:**
- Un sub-dominio **nunca importa de otro sub-dominio** (`client/` ≠ importar de `agent/`).
- `myAccount/` puede importar de `src/shared/`, pero **no** de `home/`, `buy/`, `sell/`.
- Si `client/` y `agent/` necesitan el mismo código → muévelo a `myAccount/shared/`.
- Si 3+ dominios de primer nivel necesitan algo de `myAccount/` → muévelo a `src/shared/`.

---

## myAccount/shared/ — Shared Interno

### Propósito
Código compartido **exclusivamente** entre los sub-dominios de myAccount.
No es accesible desde fuera del bounded context.

```
myAccount/shared/
├── actions/     ← Actions comunes (ej: get-notifications, get-account-settings)
├── components/  ← Componentes visuales comunes (ej: AccountSidebar, NotificationBell)
└── hooks/       ← Hooks comunes (ej: use-notifications, use-account-menu)
```

### Ejemplos de qué vive aquí
- `get-notifications.actions.ts` — todos los roles tienen notificaciones.
- `AccountHeader.tsx` — header de la sección Mi Cuenta (compartido entre roles).
- `use-account-settings.hook.ts` — configuración de cuenta básica.

---

## Sub-dominios por Rol

Cada sub-dominio (`client/`, `agent/`, `admin/`) es **autónomo** y sigue
exactamente la misma arquitectura interna que cualquier dominio de primer nivel:

```
[rol]/
├── actions/    ← Obtención y transformación de datos del rol
├── api/        ← Instancia de Axios para endpoints del rol
├── components/ ← Componentes visuales exclusivos del rol
├── hooks/      ← Custom hooks con TanStack Query del rol
├── layouts/    ← Layout visual del área de este rol
├── pages/      ← Páginas del área de este rol
├── types/      ← Interfaces exclusivas del rol
└── utils/      ← Funciones puras del rol
```

---

## myAccount/router/my-account.router.tsx

### Responsabilidad única
Recibir al usuario autenticado en `/mi-cuenta/*` y redirigirlo al sub-dominio
correcto según su rol. Lee el rol desde el hook de sesión, nunca directamente de localStorage.

### Lógica de redirección
```
user.role === 'client'  →  /mi-cuenta/cliente
user.role === 'agent'   →  /mi-cuenta/agente
user.role === 'admin'   →  /mi-cuenta/admin
sin rol / sin sesión    →  /auth/login
```

### Reglas del router interno
- Sigue exactamente las mismas reglas que `app.router.tsx` (ver `docs/architecture/router.md`).
- Usa `lazy()` + `Suspense` para todos los layouts y páginas.
- No verifica autenticación aquí — eso ya lo hizo `ProtectedRoute` en `app.router.tsx`.
- Sí puede verificar el **rol** para redirigir al área correcta.
- El `<Loading />` que usa como fallback viene de `src/shared/components/custom/Loading`.

---

## Ejemplos de Qué Va Dónde

| Código                                    | Ubicación correcta              |
|-------------------------------------------|---------------------------------|
| Lista de propiedades favoritas del cliente| `myAccount/client/`             |
| Panel de listings del agente              | `myAccount/agent/`              |
| CRUD de usuarios (solo admin)             | `myAccount/admin/`              |
| Componente de notificaciones (todos)      | `myAccount/shared/components/`  |
| Hook de sesión de usuario                 | `src/auth/hooks/`               |
| Tipo `UserRole`                           | `src/shared/types/`             |
| Tipo de perfil de agente                  | `myAccount/agent/types/`        |
| Layout del dashboard de cliente           | `myAccount/client/layouts/`     |
| Instancia Axios para endpoints de agente  | `myAccount/agent/api/`          |

---

## PROHIBICIONES

- ❌ Sub-dominios importando entre sí (`client/` de `agent/`, etc.).
- ❌ `myAccount/` importando de dominios de primer nivel (`home/`, `buy/`, `sell/`).
- ❌ Lógica de autenticación (manejo de tokens) dentro de myAccount — eso es de `auth/`.
- ❌ Verificación de autenticación en `my-account.router.tsx` — solo verificación de rol.
- ❌ Componentes duplicados en client, agent y admin si son idénticos — van a `myAccount/shared/`.
