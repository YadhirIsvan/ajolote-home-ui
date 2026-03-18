# router.md — Sistema de Rutas
## Reglas para `app.router.tsx` y `my-account.router.tsx`

> **Cuándo leer este archivo:**
> Antes de modificar `src/router/app.router.tsx` o `src/myAccount/router/my-account.router.tsx`,
> o antes de implementar `ProtectedRoute` en `src/auth/guardian/`.

---

## DOS ROUTERS, UNA ARQUITECTURA

```
src/router/app.router.tsx
└── Entry point principal. Gestiona rutas públicas, de auth y delega myAccount.

src/myAccount/router/my-account.router.tsx
└── Gestiona la distribución interna de myAccount por rol (client/agent/admin).
    Es cargado como child del app.router.tsx.
```

---

## STACK OBLIGATORIO

- **React Router v6** con `createBrowserRouter` (Data API pattern).
- **`lazy()` + `Suspense`** para TODAS las páginas y layouts sin excepción.
- **`ProtectedRoute`** para RBAC declarativo.
- **Rutas anidadas** (`children`) para jerarquía de layouts.

---

## PATRÓN DE LAZY IMPORT (Irrompible)

```tsx
// ✅ Para export default:
const BuyPage = lazy(() =>
  import('@/buy/pages/BuyPage').then(m => ({ default: m.default }))
);

// ✅ Para export nombrado:
const ClientDashboard = lazy(() =>
  import('@/myAccount/client/pages/ClientDashboard')
    .then(m => ({ default: m.ClientDashboard }))
);

// ✅ Para layouts:
const PublicLayout = lazy(() =>
  import('@/shared/components/custom/PublicLayout').then(m => ({ default: m.default }))
);
```

**Regla:** Nunca hagas import estático de páginas o layouts en el router.
Excepción permitida: `Loading` y `ProtectedRoute` (no se benefician de lazy).

---

## app.router.tsx — Estructura Completa de Referencia

```tsx
// src/router/app.router.tsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from '@/auth/guardian/ProtectedRoute';
import { Loading } from '@/shared/components/custom/Loading';

// ─── Layouts ──────────────────────────────────────────────────────
const PublicLayout = lazy(() =>
  import('@/shared/components/custom/PublicLayout').then(m => ({ default: m.default }))
);
const AuthLayout = lazy(() =>
  import('@/shared/components/custom/AuthLayout').then(m => ({ default: m.default }))
);

// ─── Páginas Públicas ─────────────────────────────────────────────
const HomePage = lazy(() =>
  import('@/home/pages/HomePage').then(m => ({ default: m.default }))
);
const BuyPage = lazy(() =>
  import('@/buy/pages/BuyPage').then(m => ({ default: m.default }))
);
const SellPage = lazy(() =>
  import('@/sell/pages/SellPage').then(m => ({ default: m.default }))
);

// ─── Páginas de Auth ──────────────────────────────────────────────
const LoginPage = lazy(() =>
  import('@/auth/pages/LoginPage').then(m => ({ default: m.default }))
);
const RegisterPage = lazy(() =>
  import('@/auth/pages/RegisterPage').then(m => ({ default: m.default }))
);

// ─── MyAccount (delega a su propio router) ────────────────────────
const MyAccountRouter = lazy(() =>
  import('@/myAccount/router/my-account.router').then(m => ({ default: m.MyAccountRouter }))
);

// ─── Router ───────────────────────────────────────────────────────
const router = createBrowserRouter([
  // ── Rutas Públicas ──────────────────────────────────────────────
  {
    path: '/',
    element: (
      <Suspense fallback={<Loading />}>
        <PublicLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Suspense fallback={<Loading />}><HomePage /></Suspense>,
      },
      {
        path: 'comprar',
        element: <Suspense fallback={<Loading />}><BuyPage /></Suspense>,
      },
      {
        path: 'vender',
        element: <Suspense fallback={<Loading />}><SellPage /></Suspense>,
      },
    ],
  },

  // ── Rutas de Auth ────────────────────────────────────────────────
  {
    path: '/auth',
    element: (
      <Suspense fallback={<Loading />}>
        <AuthLayout />
      </Suspense>
    ),
    children: [
      {
        path: 'login',
        element: <Suspense fallback={<Loading />}><LoginPage /></Suspense>,
      },
      {
        path: 'register',
        element: <Suspense fallback={<Loading />}><RegisterPage /></Suspense>,
      },
    ],
  },

  // ── Rutas Privadas — MyAccount (delega a my-account.router.tsx) ──
  {
    path: '/mi-cuenta/*',
    element: (
      <ProtectedRoute allowedRoles={['client', 'agent', 'admin']}>
        <Suspense fallback={<Loading />}>
          <MyAccountRouter />
        </Suspense>
      </ProtectedRoute>
    ),
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
```

---

## my-account.router.tsx — Distribución por Rol

```tsx
// src/myAccount/router/my-account.router.tsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Loading } from '@/shared/components/custom/Loading';
import { useAuthSession } from '@/auth/hooks/use-auth-session.auth.hook';

// ─── Client ───────────────────────────────────────────────────────
const ClientLayout = lazy(() =>
  import('@/myAccount/client/layouts/ClientLayout').then(m => ({ default: m.default }))
);
const ClientDashboard = lazy(() =>
  import('@/myAccount/client/pages/ClientDashboard').then(m => ({ default: m.default }))
);

// ─── Agent ────────────────────────────────────────────────────────
const AgentLayout = lazy(() =>
  import('@/myAccount/agent/layouts/AgentLayout').then(m => ({ default: m.default }))
);
const AgentDashboard = lazy(() =>
  import('@/myAccount/agent/pages/AgentDashboard').then(m => ({ default: m.default }))
);

// ─── Admin ────────────────────────────────────────────────────────
const AdminLayout = lazy(() =>
  import('@/myAccount/admin/layouts/AdminLayout').then(m => ({ default: m.default }))
);
const AdminDashboard = lazy(() =>
  import('@/myAccount/admin/pages/AdminDashboard').then(m => ({ default: m.default }))
);

// ─── Componente de redirección por rol ────────────────────────────
const RoleRedirect = () => {
  const { user } = useAuthSession();

  const roleRoutes: Record<string, string> = {
    client: '/mi-cuenta/cliente',
    agent:  '/mi-cuenta/agente',
    admin:  '/mi-cuenta/admin',
  };

  const destination = user?.role ? roleRoutes[user.role] : '/auth/login';
  return <Navigate to={destination} replace />;
};

// ─── Router interno ───────────────────────────────────────────────
const router = createBrowserRouter([
  {
    index: true,
    element: <RoleRedirect />,
  },

  // ── Cliente ─────────────────────────────────────────────────────
  {
    path: 'cliente',
    element: (
      <Suspense fallback={<Loading />}>
        <ClientLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Suspense fallback={<Loading />}><ClientDashboard /></Suspense>,
      },
    ],
  },

  // ── Agente ──────────────────────────────────────────────────────
  {
    path: 'agente',
    element: (
      <Suspense fallback={<Loading />}>
        <AgentLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Suspense fallback={<Loading />}><AgentDashboard /></Suspense>,
      },
    ],
  },

  // ── Admin ────────────────────────────────────────────────────────
  {
    path: 'admin',
    element: (
      <Suspense fallback={<Loading />}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Suspense fallback={<Loading />}><AdminDashboard /></Suspense>,
      },
    ],
  },
]);

export const MyAccountRouter = () => <RouterProvider router={router} />;
```

---

## ProtectedRoute (src/auth/guardian/ProtectedRoute.tsx)

```tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = '/auth/login',
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuthSession();
  const location = useLocation();

  if (isLoading) return null; // evita flash de contenido no autorizado

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user?.role ?? '')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

---

## REGLAS GENERALES DEL ROUTER

### Al añadir una nueva página
```
□ Añadir lazy import con el patrón .then(m => ({ default: m.default })).
□ Ubicarla en la sección correcta (pública, auth, client, agent, admin).
□ Envolverla en <Suspense fallback={<Loading />}>.
□ Si es privada, verificar que su layout padre ya tiene ProtectedRoute.
□ Actualizar el router correcto: app.router.tsx o my-account.router.tsx.
```

### Prohibiciones
- ❌ Imports estáticos de páginas o layouts.
- ❌ Lógica de negocio o fetching dentro de los archivos de router.
- ❌ Verificación de roles directamente en el router (delega a ProtectedRoute).
- ❌ Más de un `createBrowserRouter` por router file.
- ❌ Componentes lazy sin su `<Suspense>` correspondiente.
- ❌ `ProtectedRoute` fuera de `src/auth/guardian/`.
