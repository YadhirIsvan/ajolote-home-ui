# domain-hooks.md — Capa de Lógica de Dominio
## Reglas para `/hooks`, `/types` y `/utils`

> **Cuándo leer este archivo:**
> Antes de crear o modificar archivos en carpetas `/hooks`, `/types` o `/utils`
> de cualquier dominio o sub-dominio.

---

## /hooks — Custom Hooks

### Principio
Los Custom Hooks son el **cerebro del dominio**. Son el único punto de orquestación
entre la capa visual y la capa de datos. Encapsulan todo lo que un componente necesita
saber sobre el estado y los datos, sin exponer los detalles de implementación.

### Responsabilidades del Hook
- Orquestar llamadas a `actions` vía `useQuery` o `useMutation` (TanStack Query).
- Exponer al componente: `data`, `isLoading`, `isError`, `error`, y funciones de acción.
- Gestionar estado local del dominio relacionado con los datos.
- Nunca hacer fetching directo. Nunca importar axios.

### Naming Convention
```
use-[recurso].[dominio].hook.ts

Ejemplos:
  use-listings.buy.hook.ts
  use-listing-detail.buy.hook.ts
  use-sell-form.sell.hook.ts
  use-auth-session.auth.hook.ts
  use-client-profile.client.hook.ts    ← dentro de myAccount/client/
  use-agent-dashboard.agent.hook.ts    ← dentro de myAccount/agent/
```

### Patrón useQuery (Lectura de datos)

```typescript
// src/buy/hooks/use-listings.buy.hook.ts
import { useQuery } from '@tanstack/react-query';
import { getListingsByFilter } from '../actions/get-listings-by-filter.actions';
import type { PropertyListing } from '../types';

interface UseListingsReturn {
  listings: PropertyListing[];
  pagination: { total: number; currentPage: number; totalPages: number };
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useListings = (page = 1): UseListingsReturn => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['listings', page],
    queryFn: () => getListingsByFilter({ page }),
    staleTime: 1000 * 60 * 5,  // 5 minutos
    placeholderData: (prev) => prev, // mantiene data anterior al paginar
  });

  return {
    listings: data?.listings ?? [],
    pagination: data?.pagination ?? { total: 0, currentPage: 1, totalPages: 1 },
    isLoading,
    isError,
    error: error as Error | null,
  };
};
```

### Patrón useMutation (Escritura de datos)

```typescript
// src/sell/hooks/use-create-listing.sell.hook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createListing } from '../actions/create-listing.actions';
import type { CreateListingParams } from '../types';

export const useCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateListingParams) => createListing(params),
    onSuccess: () => {
      // Invalida el cache de listings para forzar refetch
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
    onError: (error: Error) => {
      console.error('[useCreateListing] Error:', error.message);
    },
  });
};
```

### Reglas de Query Keys
```typescript
// Estructura: [recurso, ...parametros]
['listings']                    // colección sin filtros
['listings', page]              // colección paginada
['listings', { page, filter }]  // colección con múltiples filtros
['listing', id]                 // entidad individual
['agent-profile', agentId]      // entidad de sub-dominio
```

### Señales de Alarma en Hooks

```typescript
// 🚨 ALARMA: Fetch directo — usar action
const fetchData = async () => {
  const res = await axios.get('/listings'); // ← VIOLACIÓN
};

// 🚨 ALARMA: useState + useEffect manual
const [data, setData] = useState([]);
useEffect(() => {
  fetchData().then(setData); // ← REEMPLAZAR CON useQuery
}, []);
```

---

## /types — Interfaces y Types del Dominio

### Principio
Los types son los **contratos de datos** del dominio. Son la única fuente de verdad
sobre la forma de los datos que maneja ese dominio.

### Reglas de Alcance
- Type usado por **1 dominio** → vive en `src/[dominio]/types/`.
- Type usado por **2+ dominios** → muévelo a `src/shared/types/`.
- Type del bounded context myAccount compartido entre client/agent/admin → `myAccount/shared/`.
- Types de respuesta RAW de API → viven en `/actions` junto a la action que los usa.

### Estructura recomendada

```typescript
// src/buy/types/index.ts

// ── Entidad principal del dominio ─────────────────────────────────
export interface PropertyListing {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  areaM2: number;
  publishedAt: string;
  isFeatured: boolean;
  agentId: string | null;
}

// ── Filtros y estado de UI del dominio ────────────────────────────
export interface ListingFilters {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  propertyType?: PropertyType;
}

// ── Enums y unions del dominio ────────────────────────────────────
export type PropertyType = 'house' | 'apartment' | 'land' | 'commercial';

export type ListingSortOrder = 'price_asc' | 'price_desc' | 'newest' | 'oldest';
```

### Convenciones de Naming

| Tipo                  | Convención              | Ejemplo                      |
|-----------------------|-------------------------|------------------------------|
| Entidad de dominio    | PascalCase, singular    | `PropertyListing`            |
| Respuesta RAW de API  | PascalCase + Raw        | `ApiListingRaw`              |
| Resultado de action   | PascalCase + Result     | `GetListingsResult`          |
| Parámetros            | PascalCase + Params     | `GetListingsByFilterParams`  |
| Filtros de UI         | PascalCase + Filters    | `ListingFilters`             |
| Enums                 | PascalCase              | `PropertyType`               |

### Reglas Estrictas
- Cero `type X = any`.
- Prefiere `interface` para objetos (mejores mensajes de error en TS).
- Usa `type` para unions, intersections y aliases de primitivos.
- Exporta siempre. No declares interfaces locales sin exportar.

---

## /utils — Funciones Puras

### Principio
Las utils son funciones **puras y sin estado**. Entran datos → salen datos. Sin efectos secundarios.

### Criterio definitivo de pureza
> ¿Se puede testear esta función de forma completamente aislada,
> sin mocks de React ni de API? Si la respuesta es sí → es una util correcta.

### Patrón Correcto

```typescript
// src/buy/utils/format-listing-price.utils.ts

/**
 * Formatea un precio con símbolo de moneda y separadores locales.
 * @pure — sin efectos secundarios
 */
export const formatListingPrice = (price: number, currency: string): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Calcula el precio por m² de una propiedad.
 * @pure — sin efectos secundarios
 */
export const calculatePricePerM2 = (price: number, areaM2: number): number => {
  if (areaM2 <= 0) return 0;
  return Math.round(price / areaM2);
};
```

### Naming de Utils
```
[verbo]-[recurso].utils.ts

Ejemplos:
  format-listing-price.utils.ts
  calculate-price-per-m2.utils.ts
  parse-property-type.utils.ts
  truncate-description.utils.ts
```

### Prohibiciones en /utils
- ❌ Imports de React o hooks.
- ❌ Llamadas a API, localStorage o cualquier efecto secundario.
- ❌ Estado interno mutable.
- ❌ Lógica condicional de negocio compleja (eso va en actions o hooks).
