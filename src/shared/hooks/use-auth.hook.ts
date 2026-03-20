// La implementación y el estado viven en auth.context.tsx (singleton compartido).
// Este archivo re-exporta useAuth para que todos los imports existentes sigan funcionando.
export { useAuth } from "@/shared/hooks/auth.context";
