# data-layer.md — Capa de Datos
## Reglas para `/actions` y `/api`

> **Cuándo leer este archivo:**
> Antes de crear o modificar cualquier archivo en carpetas `/actions` o `/api`
> de cualquier dominio (`home/`, `buy/`, `sell/`, `auth/`, `myAccount/client/`, etc.)

---

## PRINCIPIO FUNDAMENTAL

La capa de datos es la **única frontera entre tu aplicación y el mundo exterior**.
Su contrato es claro y no negociable:

1. Recibe parámetros tipados del hook.
2. Llama a la API usando la instancia del dominio.
3. Transforma la respuesta cruda en una entidad del dominio.
4. Devuelve datos limpios y tipados, o lanza un error descriptivo.

El resto de la aplicación no sabe (ni le importa) cómo se obtuvieron los datos.

---

## /api — Instancias de Axios

### Regla Crítica: La cadena de herencia

```
src/shared/api/axios.instance.ts   ← BASE: nunca modificar desde dominios
         │
         └── src/[dominio]/api/[dominio].api.ts   ← Extiende la base
```

### Implementación de la instancia BASE (src/shared/api/)

```typescript
// src/shared/api/axios.instance.ts
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor global: adjunta token de autenticación
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor global: manejo de errores HTTP
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar sesión y redirigir
      localStorage.removeItem('auth_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
```

### Implementación de instancia de dominio

```typescript
// src/buy/api/buy.api.ts
import { axiosInstance } from '@/shared/api/axios.instance';

// Si el dominio no necesita configuración extra, re-exporta directamente:
export const buyApi = axiosInstance;

// Si necesita un baseURL o headers específicos del dominio:
// import axios from 'axios';
// export const buyApi = axios.create({
//   ...axiosInstance.defaults,
//   baseURL: `${import.meta.env.VITE_API_BASE_URL}/listings`,
// });
```

### Naming de archivos /api
```
[dominio].api.ts

Ejemplos:
  home.api.ts
  buy.api.ts
  sell.api.ts
  auth.api.ts
  client.api.ts      ← dentro de myAccount/client/api/
  agent.api.ts       ← dentro de myAccount/agent/api/
```

### Prohibiciones en /api
- ❌ `import axios from 'axios'` directo en archivos de dominio (sin extender la base).
- ❌ Hardcodear URLs o tokens.
- ❌ Lógica de negocio o transformación de datos.
- ❌ Interceptors de negocio en instancias de dominio (solo en `shared/api`).

---

## /actions — Funciones de Obtención y Transformación

### Anatomía obligatoria de una action

Cada archivo de action DEBE contener en este orden:

```
1. Interface RAW       → cómo responde el backend (snake_case, tipos inconsistentes)
2. Interface resultado → entidad limpia que consume el dominio (camelCase, tipos correctos)
3. Función async       → con tipos explícitos en parámetros y retorno
4. Try/catch           → con log contextual y re-lanzamiento descriptivo
5. Transformación      → normaliza, limpia y mapea raw → entidad
```

### Ejemplo completo — dominio buy/

```typescript
// src/buy/actions/get-listings-by-filter.actions.ts
import { buyApi } from '../api/buy.api';
import type { PropertyListing } from '../types';

// ── 1. Interface RAW (cómo llega del backend) ──────────────────────
interface ApiListingRaw {
  listing_id: string;
  property_title: string;
  listing_price: number;
  price_currency: string;
  main_image_url: string | null;
  bedrooms_count: number;
  bathrooms_count: number;
  total_area_m2: number;
  published_at: string;
  is_featured: number;        // backend devuelve 0/1
  agent_id: string | null;
}

interface GetListingsRawResponse {
  items: ApiListingRaw[];
  meta: {
    total_count: number;
    current_page: number;
    total_pages: number;
  };
}

// ── 2. Interface del resultado transformado ────────────────────────
export interface GetListingsByFilterResult {
  listings: PropertyListing[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
  };
}

// ── 3. Parámetros de entrada tipados ──────────────────────────────
export interface GetListingsByFilterParams {
  page: number;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
}

// ── 4. La action ──────────────────────────────────────────────────
export const getListingsByFilter = async (
  params: GetListingsByFilterParams
): Promise<GetListingsByFilterResult> => {
  try {
    const { data } = await buyApi.get<GetListingsRawResponse>('/listings', {
      params: {
        page: params.page,
        min_price: params.minPrice,
        max_price: params.maxPrice,
        bedrooms: params.bedrooms,
      },
    });

    // ── 5. Transformación y limpieza ────────────────────────────
    const listings: PropertyListing[] = data.items.map((raw) => ({
      id: raw.listing_id,
      title: raw.property_title.trim(),
      price: raw.listing_price,
      currency: raw.price_currency,
      imageUrl: raw.main_image_url ?? '/assets/placeholder-property.jpg',
      bedrooms: raw.bedrooms_count,
      bathrooms: raw.bathrooms_count,
      areaM2: raw.total_area_m2,
      publishedAt: raw.published_at,
      isFeatured: Boolean(raw.is_featured),
      agentId: raw.agent_id ?? null,
    }));

    return {
      listings,
      pagination: {
        total: data.meta.total_count,
        currentPage: data.meta.current_page,
        totalPages: data.meta.total_pages,
      },
    };

  } catch (error) {
    console.error('[getListingsByFilter] Error al obtener listings:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Error desconocido al obtener los listings'
    );
  }
};
```

### Naming Convention
```
[verbo]-[recurso]-by-[criterio].actions.ts   ← con criterio de filtrado
[verbo]-[recurso].actions.ts                 ← operación directa

Ejemplos:
  get-listings-by-filter.actions.ts
  get-listing-by-id.actions.ts
  create-listing.actions.ts
  update-listing-status.actions.ts
  delete-listing.actions.ts
  get-agent-profile.actions.ts
```

### Reglas de Transformación (obligatorio en cada action)

| Raw del backend       | Transformación requerida              |
|-----------------------|---------------------------------------|
| `snake_case`          | Convertir a `camelCase`               |
| `null` / `undefined`  | Aplicar fallback explícito            |
| `0` / `1` (booleano)  | `Boolean(value)`                      |
| Strings del usuario   | `.trim()`                             |
| Fechas ISO            | Conservar como string o convertir con util |
| Números como strings  | `Number(value)` o `parseFloat(value)` |

### Reglas de Error Handling

```typescript
// ✅ Patrón obligatorio
try {
  // ... lógica
} catch (error) {
  // Log con nombre de action entre corchetes para tracing
  console.error('[nombreDeLaAction] Descripción:', error);

  // Re-lanza SIEMPRE — nunca silencies errores
  throw new Error(
    error instanceof Error ? error.message : 'Error desconocido'
  );
}
```

- Nunca `catch(e) {}` vacío.
- Nunca devuelvas `null` en caso de error — lanza un `Error`.
- Nunca devuelvas el error HTTP crudo al dominio — normaliza el mensaje.

### Prohibiciones en /actions
- ❌ `import React` — las actions son TypeScript puro, sin React.
- ❌ `axios` directo — siempre la instancia del dominio desde `/api`.
- ❌ Acceso a `localStorage`, cookies o estado global directamente
  (el interceptor de `shared/api` ya maneja el token).
- ❌ Lógica de UI, redirecciones o side effects de presentación.
- ❌ Interfaces sin exportar si son usadas fuera del archivo.

---

## CHECKLIST DE VALIDACIÓN

Antes de considerar una action terminada:

```
□ ¿Tiene interface tipada para la respuesta RAW del backend?
□ ¿Tiene interface tipada para el resultado transformado?
□ ¿Tiene interface tipada para los parámetros de entrada?
□ ¿Normaliza snake_case a camelCase en todos los campos?
□ ¿Maneja todos los posibles null/undefined con fallbacks?
□ ¿Normaliza tipos incorrectos (0/1 → boolean, strings → numbers)?
□ ¿Tiene try/catch con log descriptivo entre corchetes?
□ ¿Re-lanza el error con mensaje normalizado?
□ ¿Usa la instancia de API del dominio (no axios directo)?
□ ¿Está libre de imports de React?
□ ¿El naming del archivo sigue la convención kebab-case.actions.ts?
□ ¿Todas las interfaces están exportadas?
```
