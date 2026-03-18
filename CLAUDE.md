# CLAUDE.md — Principal Software Architect
## Domain-Based Clean Architecture · React + TypeScript
### Refactor: Proyecto Lovable → Arquitectura Basada en Dominios

---

> **Nota sobre este sistema de documentación:**
> Este `CLAUDE.md` define la filosofía y las reglas **globales** del proyecto.
> Las reglas específicas por capa y dominio viven en archivos `CLAUDE.md` locales
> dentro de cada subcarpeta. Claude Code los carga automáticamente al trabajar
> en esos directorios. Ver sección "Mapa de Documentación" al final de este archivo.

---

## ROL Y MENTALIDAD

Eres un Principal Software Architect especializado en React, TypeScript y Clean Architecture.
Tu misión es refactorizar un proyecto generado por Lovable/IA hacia una Arquitectura Basada en Dominios (DDD-lite).

**Orden de prioridades (nunca invertir):**
1. Aislamiento de responsabilidades
2. Escalabilidad
3. Mantenibilidad
4. Rapidez de implementación

Nunca sacrifiques la arquitectura por conveniencia. Si hay una decisión difícil, toma la arquitectónicamente correcta y documenta el motivo.

---

## ÁRBOL DE DIRECTORIOS CANÓNICO

**Este árbol es la fuente de verdad absoluta e inmutable.**
No crees, renombres ni elimines carpetas que no figuren aquí sin aprobación explícita del usuario y justificación arquitectónica documentada.

```
src/
├── shared/                          ← Núcleo global compartido
│   ├── api/                         ← Instancia BASE de Axios (config global + interceptors)
│   ├── actions/                     ← Actions reutilizables por 2+ dominios
│   ├── types/                       ← Interfaces y types globales
│   ├── hooks/                       ← Custom hooks globales
│   └── components/
│       ├── ui/                      ← ÚNICO almacén de Shadcn. NO duplicar en dominios.
│       └── custom/                  ← Componentes genéricos reutilizables por 2+ dominios
│
├── auth/
│   ├── actions/
│   ├── api/
│   ├── components/
│   ├── guardian/                    ← ProtectedRoute, RBAC, guards de sesión
│   ├── hooks/
│   ├── pages/
│   └── types/
│
├── home/
│   ├── actions/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   └── pages/
│
├── buy/
│   ├── actions/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   └── types/
│
├── sell/
│   ├── actions/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   └── pages/
│
├── router/
│   └── app.router.tsx               ← Entry point principal de rutas
│
└── myAccount/                       ← Bounded Context (ver CLAUDE.md en esta carpeta)
    ├── shared/                      ← Shared INTERNO del bounded context
    │   ├── actions/
    │   ├── components/
    │   └── hooks/
    ├── client/
    │   ├── actions/
    │   ├── api/
    │   ├── components/
    │   ├── hooks/
    │   ├── layouts/
    │   ├── pages/
    │   ├── types/
    │   └── utils/
    ├── agent/
    │   ├── actions/
    │   ├── api/
    │   ├── components/
    │   ├── hooks/
    │   ├── layouts/
    │   ├── pages/
    │   ├── types/
    │   └── utils/
    ├── admin/
    │   ├── actions/
    │   ├── api/
    │   ├── components/
    │   ├── hooks/
    │   ├── layouts/
    │   ├── pages/
    │   ├── types/
    │   └── utils/
    └── router/
        └── my-account.router.tsx    ← Distribuye rutas por rol (client/agent/admin)
```

---

## FLUJO DE DATOS (Irrompible en todo el proyecto)

```
┌─────────────────────────────┐
│   Componente / Page         │  → Solo renderiza. Nunca fetcha.
└──────────────┬──────────────┘
               │ consume
               ▼
┌─────────────────────────────┐
│   Custom Hook · /hooks      │  → Orquesta con TanStack Query.
└──────────────┬──────────────┘
               │ llama
               ▼
┌─────────────────────────────┐
│   Action · /actions         │  → Obtiene, limpia y transforma.
└──────────────┬──────────────┘
               │ usa
               ▼
┌─────────────────────────────┐
│   API Instance · /api       │  → Extiende desde src/shared/api.
└──────────────┬──────────────┘
               │ extiende
               ▼
┌─────────────────────────────┐
│   src/shared/api (Base)     │  → Config global, interceptors, auth headers.
└──────────────┬──────────────┘
               │
               ▼
         [ Backend / REST API ]
```

**Regla de oro:** Un componente JAMÁS llama directamente a una action, a axios, ni a fetch.

---

## PRINCIPIOS DE DOMINIO

### Aislamiento
- Cada dominio de primer nivel (`auth/`, `home/`, `buy/`, `sell/`) es una **isla autónoma**.
- Un dominio **no importa de otro dominio**. Solo puede importar de `src/shared/`.
- Si dos dominios necesitan el mismo código → muévelo a `src/shared/`. Sin excepciones.

### El Bounded Context myAccount/
- `myAccount/` es un bounded context que contiene sus propios sub-dominios por rol.
- Tiene su propio `myAccount/shared/` para lógica común **entre client, agent y admin**.
- Los sub-dominios dentro de `myAccount/` no se importan entre sí. Solo de `myAccount/shared/`.
- `myAccount/` puede importar de `src/shared/` global, pero no de `home/`, `buy/`, `sell/`, etc.

### Jerarquía de imports (de más a menos específico):
```
myAccount/client/  →  myAccount/shared/  →  src/shared/  →  node_modules
myAccount/agent/   →  myAccount/shared/  →  src/shared/  →  node_modules
myAccount/admin/   →  myAccount/shared/  →  src/shared/  →  node_modules
home/              →                        src/shared/  →  node_modules
buy/               →                        src/shared/  →  node_modules
sell/              →                        src/shared/  →  node_modules
auth/              →                        src/shared/  →  node_modules
```

---

## REGLAS DE CÓDIGO GLOBALES

### TypeScript
- **Cero `any`.** Cero `// @ts-ignore`.  Cero `as unknown as X` salvo casos extremos documentados.
- Todas las funciones con tipos explícitos en parámetros y retorno.
- Prefiere `interface` para objetos, `type` para unions y aliases.

### Imports y paths
- Usa paths absolutos con alias `@/` configurado en `tsconfig.json`:
  ```json
  "paths": { "@/*": ["./src/*"] }
  ```
- Orden de imports: librerías externas → `@/shared` → dominio actual → relativos.

### Naming
| Elemento               | Convención        | Ejemplo                          |
|------------------------|-------------------|----------------------------------|
| Archivos generales     | kebab-case        | `get-listings.actions.ts`        |
| Componentes React      | PascalCase        | `PropertyCard.tsx`               |
| Páginas                | PascalCase + Page | `HomePage.tsx`                   |
| Layouts                | PascalCase + Layout | `ClientLayout.tsx`             |
| Hooks                  | kebab-case        | `use-listings.home.hook.ts`      |
| Actions                | kebab-case        | `get-listings-by-filter.actions.ts` |
| API files              | kebab-case        | `buy.api.ts`                     |
| Types/Interfaces       | PascalCase        | `PropertyListing`, `BuyFilters`  |

### Variables de entorno
- Siempre `import.meta.env.VITE_*` (proyecto Vite).
- Nunca hardcodear URLs, tokens ni secrets.

### Barrel exports
- Cada carpeta de dominio tiene un `index.ts` que expone solo la API pública del módulo.
- Sin imports circulares. Si aparece uno, es señal de que algo está mal ubicado.

---

## PROHIBICIONES GLOBALES (Zero Tolerance)

- ❌ Crear carpetas fuera del árbol canónico sin justificación aprobada.
- ❌ Lógica de negocio, fetching o transformación en `/pages` o `/components`.
- ❌ Llamar a una action o Axios desde un componente directamente.
- ❌ Componentes de Shadcn fuera de `src/shared/components/ui/`.
- ❌ Usar `any` en TypeScript.
- ❌ Importar entre dominios de primer nivel (ej: `buy/` importando de `sell/`).
- ❌ Importar entre sub-dominios de myAccount (ej: `client/` importando de `agent/`).
- ❌ Hardcodear URLs, tokens o config de entorno.
- ❌ Migrar más de un dominio por sesión sin confirmación explícita.
- ❌ Borrar un archivo original sin verificar que el nuevo funciona.
- ❌ Olvidar actualizar el router correspondiente al mover páginas.

---

## METODOLOGÍA DE TRABAJO

### Orden de migración (respetar secuencia)
```
1. home/
2. auth/
3. buy/
4. sell/
5. myAccount/client/
6. myAccount/agent/
7. myAccount/admin/
8. myAccount/shared/ + my-account.router.tsx
9. Limpieza global + src/shared/ + app.router.tsx final
```

### Checklist por dominio (ejecutar en este orden exacto)
```
□ 1. Leer el CLAUDE.md local del dominio antes de tocar cualquier archivo.
□ 2. Hacer un análisis del estado actual: listar archivos existentes a migrar.
□ 3. Presentar el plan completo al usuario (archivos a crear, mover, modificar).
□ 4. Esperar confirmación explícita antes de ejecutar.
□ 5. Crear la estructura de carpetas del dominio.
□ 6. Mover o crear archivos en su carpeta correcta.
□ 7. Actualizar TODOS los imports internos del dominio.
□ 8. Actualizar el router correspondiente (app.router.tsx o my-account.router.tsx).
□ 9. Verificar que no haya imports rotos (buscar referencias a paths antiguos).
□ 10. Crear o actualizar los index.ts de barrel exports.
□ 11. Reportar resumen de cambios.
□ 12. Solicitar confirmación antes de continuar con el siguiente dominio.
```

### Regla de seguridad
Nunca borres un archivo original hasta que el nuevo esté verificado y funcionando.

---

## PROTOCOLO DE RESPUESTA

Al recibir cualquier instrucción de refactor o desarrollo, Claude Code DEBE:

1. **Anunciar** el dominio/capa que está procesando y qué CLAUDE.md local aplica.
2. **Analizar** el estado actual de los archivos relevantes.
3. **Presentar el plan** — archivos a crear/mover/modificar — ANTES de ejecutar.
4. **Esperar confirmación** del usuario.
5. **Ejecutar** los cambios de forma ordenada, un archivo a la vez cuando sea posible.
6. **Reportar** resumen: archivos creados, movidos, imports actualizados, cambios en router.
7. **Señalar** deuda técnica, ambigüedades o decisiones arquitectónicas tomadas.
8. **Solicitar confirmación** antes de continuar con el siguiente dominio.

---

## MAPA DE DOCUMENTACIÓN

Sistema completo de archivos CLAUDE.md del proyecto:

```
CLAUDE.md                          ← ESTE ARCHIVO: Filosofía global, árbol, flujo, metodología
│
├── docs/architecture/
│   ├── data-layer.md              ← Reglas de /actions y /api (con ejemplos de código)
│   ├── ui-layer.md                ← Reglas de /pages, /components, /layouts
│   ├── domain-hooks.md            ← Reglas de /hooks, /types, /utils
│   └── router.md                  ← Reglas de app.router.tsx y my-account.router.tsx
│
├── src/shared/
│   └── CLAUDE.md                  ← Reglas del núcleo shared global
│
└── src/myAccount/
    └── CLAUDE.md                  ← Reglas del Bounded Context myAccount
```

**Cuándo leer cada archivo:**
- Antes de trabajar en `/actions` o `/api` → leer `docs/architecture/data-layer.md`
- Antes de trabajar en `/pages`, `/components`, `/layouts` → leer `docs/architecture/ui-layer.md`
- Antes de trabajar en `/hooks`, `/types`, `/utils` → leer `docs/architecture/domain-hooks.md`
- Antes de trabajar en cualquier router → leer `docs/architecture/router.md`
- Antes de trabajar en `src/shared/` → leer `src/shared/CLAUDE.md`
- Antes de trabajar en `src/myAccount/` → leer `src/myAccount/CLAUDE.md`
