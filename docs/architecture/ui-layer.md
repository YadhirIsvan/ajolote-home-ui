# ui-layer.md — Capa de Vista
## Reglas para `/pages`, `/components` y `/layouts`

> **Cuándo leer este archivo:**
> Antes de crear o modificar cualquier archivo `.tsx` en carpetas
> `/pages`, `/components` o `/layouts` de cualquier dominio.

---

## PRINCIPIO FUNDAMENTAL

Los archivos en `/pages`, `/components` y `/layouts` son **esclavos visuales**.

```
Responsabilidad única: recibir datos → renderizar JSX → disparar callbacks.
```

Cualquier otra lógica es una violación arquitectónica que debe refactorizarse hacia `/hooks`.

---

## RESPONSABILIDADES PERMITIDAS ✅

- Renderizar JSX a partir de props o valores expuestos por un Custom Hook.
- Estado de UI puro y local: `isOpen`, `activeTab`, `hoveredId` (sin relación con datos remotos).
- Llamar funciones de callback recibidas por props o expuestas por hooks.
- Composición de otros componentes visuales.
- Aplicar clases de Tailwind y lógica de presentación.
- Un único `useEffect` para efectos visuales (scroll restoration, focus management).

---

## RESPONSABILIDADES PROHIBIDAS ❌

- ❌ `fetch`, `axios` o cualquier llamada HTTP directa.
- ❌ Importar o llamar funciones de `/actions` directamente.
- ❌ `useEffect` para obtener datos remotos.
- ❌ Transformar, formatear o limpiar datos crudos de API.
- ❌ Lógica de negocio, validaciones de dominio o reglas condicionales complejas.
- ❌ Manejar tokens, roles o permisos directamente.
- ❌ Más de un `useState` relacionado con datos remotos (señal de refactor).

---

## SEÑALES DE ALARMA (Refactor inmediato)

```tsx
// 🚨 ALARMA 1: HTTP directo en componente
useEffect(() => {
  axios.get('/api/listings').then(res => setData(res.data)); // ← MOVER A HOOK
}, []);

// 🚨 ALARMA 2: Action llamada desde componente
const handleLoad = async () => {
  const result = await getListingsByFilter({ page: 1 }); // ← MOVER A HOOK
};

// 🚨 ALARMA 3: Estado de datos remotos en el componente
const [listings, setListings] = useState([]);
const [isLoading, setIsLoading] = useState(false);  // ← TODO ESTO VA AL HOOK
const [error, setError] = useState(null);
```

---

## PATRÓN CORRECTO

```tsx
// ✅ BuyPage.tsx — Solo consume el hook, solo renderiza
import { useListings } from '../hooks';
import { PropertyCard } from '../components/PropertyCard';
import { ListingsFilter } from '../components/ListingsFilter';

const BuyPage = () => {
  const { listings, isLoading, isError, filters, onFilterChange } = useListings();

  if (isLoading) return <LoadingSpinner />;
  if (isError)   return <ErrorMessage />;

  return (
    <main className="container mx-auto py-8">
      <ListingsFilter filters={filters} onChange={onFilterChange} />
      <div className="grid grid-cols-3 gap-6 mt-6">
        {listings.map(listing => (
          <PropertyCard key={listing.id} listing={listing} />
        ))}
      </div>
    </main>
  );
};

export default BuyPage;
```

---

## REGLAS DE COMPONENTES SHADCN

- Shadcn **SOLO** existe en `src/shared/components/ui/`.
- **Nunca** copies, dupliques ni recrees un componente Shadcn dentro de un dominio.
- Para extender Shadcn: crea un wrapper en `src/shared/components/custom/` con documentación del motivo.
- Importa siempre desde `@/shared/components/ui/`.

```tsx
// ✅ Correcto
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

// ❌ Incorrecto — nunca recrees Shadcn en el dominio
// src/buy/components/Button.tsx  ← VIOLACIÓN
```

---

## REGLAS DE LAYOUTS

- Los layouts definen **únicamente estructura visual**: grids, sidebars, headers, footers.
- No contienen lógica de autenticación (delegan a `auth/guardian/ProtectedRoute`).
- Layouts de dominio viven en `src/[dominio]/layouts/`.
- Layouts del bounded context `myAccount` viven en `src/myAccount/[rol]/layouts/`.
- Layouts globales (PublicLayout, etc.) viven en `src/shared/components/custom/`.

---

## TIPADO DE PROPS (Obligatorio)

```tsx
// ✅ Correcto — interface explícita, sin React.FC
interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  onSelect: (id: string) => void;
}

const PropertyCard = ({ id, title, price, imageUrl, onSelect }: PropertyCardProps) => {
  return (
    <div onClick={() => onSelect(id)}>
      <img src={imageUrl} alt={title} />
      <h3>{title}</h3>
      <p>{price}</p>
    </div>
  );
};

export default PropertyCard;

// ❌ Incorrecto
const PropertyCard: React.FC<any> = (props) => { ... };
```

---

## CONVENCIONES DE NAMING

| Tipo       | Convención          | Ejemplo                  |
|------------|---------------------|--------------------------|
| Componente | PascalCase          | `PropertyCard.tsx`       |
| Página     | PascalCase + Page   | `BuyPage.tsx`            |
| Layout     | PascalCase + Layout | `ClientLayout.tsx`       |
| Props type | PascalCase + Props  | `PropertyCardProps`      |
