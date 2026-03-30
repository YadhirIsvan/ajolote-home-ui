# testing.md — Estrategia de Unit Testing
## Stack: Vitest + React Testing Library + MSW

---

## PIRÁMIDE DE TESTING (Dónde va el 80%)

Distribuye el esfuerzo así, de mayor a menor:

┌─────────────────────────────────────┐
│         E2E (Playwright)  ~5%       │  ← Solo flujos críticos
├─────────────────────────────────────┤
│    Integración (Hooks)    ~25%      │  ← Hooks con MSW
├─────────────────────────────────────┤
│  Unitario (Actions+Utils) ~70%      │  ← Foco principal
└─────────────────────────────────────┘

---

## QUÉ TESTEAR (y qué NO)

### TESTEAR OBLIGATORIO ✅
- /actions → transformación de datos, manejo de errores, casos edge
- /utils   → todas las funciones puras (son las más fáciles y valiosas)
- /hooks   → estados de loading, error, success con MSW mockeando la API
- auth/guardian/ProtectedRoute → redirección por rol

### NO TESTEAR ❌ (bajo ROI)
- Componentes puramente visuales (markup estático)
- Librerías de terceros (Shadcn, axios, React Router)
- Archivos /api (solo configuración de Axios)
- app.router.tsx y my-account.router.tsx

---

## STACK Y CONFIGURACIÓN

### Dependencias
npm install -D vitest @vitest/ui jsdom 
npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom
npm install -D msw

### vite.config.ts
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: ['./src/test/setup.ts'],
  coverage: {
    provider: 'v8',
    include: ['src/**/actions/**', 'src/**/hooks/**', 'src/**/utils/**'],
    exclude: ['src/**/api/**', 'src/**/pages/**', 'src/**/components/**'],
    thresholds: { lines: 80, functions: 80, branches: 75 }
  }
}

---

## PATRONES DE TEST

### Action (datos + error handling)
describe('getListingsByFilter', () => {
  it('transforma snake_case a camelCase correctamente', async () => {})
  it('aplica fallback cuando imageUrl es null', async () => {})
  it('convierte is_featured de 0/1 a boolean', async () => {})
  it('lanza Error con mensaje descriptivo si la API falla', async () => {})
  it('lanza Error si el servidor responde 500', async () => {})
})

### Hook con MSW
describe('useListings', () => {
  it('devuelve isLoading:true mientras fetcha', async () => {})
  it('devuelve listings al completar fetch exitoso', async () => {})
  it('devuelve isError:true si la action falla', async () => {})
})

### Util (pura)
describe('formatListingPrice', () => {
  it('formatea precio en MXN correctamente', () => {})
  it('maneja precio 0', () => {})
  it('maneja números negativos', () => {})
})

---

## CONVENCIÓN DE ARCHIVOS

Co-ubicados junto al archivo que testean:
src/buy/actions/get-listings-by-filter.actions.ts
src/buy/actions/get-listings-by-filter.actions.test.ts

src/buy/hooks/use-listings.buy.hook.ts  
src/buy/hooks/use-listings.buy.hook.test.ts

src/buy/utils/format-listing-price.utils.ts
src/buy/utils/format-listing-price.utils.test.ts

---

## ORDEN DE IMPLEMENTACIÓN

Mismo orden que el refactor:
1. shared/utils → shared/actions
2. home/ → auth/ → buy/ → sell/
3. myAccount/client/ → agent/ → admin/
```

### Qué le dices a Claude Code para arrancar los tests

Después de que termines el refactor completo y los fixes de seguridad:
```
Lee docs/architecture/testing.md.

Empieza por el dominio `home/`. 
Identifica todos los archivos en /actions y /utils que aún no tienen 
su archivo .test.ts correspondiente.

Muéstrame la lista y el plan de tests que vas a escribir para cada uno 
(casos que cubrirás) antes de escribir una sola línea de código.