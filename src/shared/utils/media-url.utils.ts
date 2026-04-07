/**
 * Utilidades para construir URLs absolutas de media y API.
 *
 * VITE_API_BASE_URL debe estar definida en el entorno.
 * Ejemplo: http://localhost:8000/api/v1  (local)
 *          https://api.avakanta.com/api/v1  (producción)
 *
 * El origen se extrae de la URL base, por lo que no importa
 * si incluye path (/api/v1) — solo se usa el scheme + host + port.
 */

/**
 * Construye la URL absoluta para un path de media del backend.
 * Si el path no empieza con "/media/", lo devuelve sin modificar.
 *
 * @example
 * getMediaUrl("/media/avatars/7/abc123_small.webp")
 * // => "https://api.avakanta.com/media/avatars/7/abc123_small.webp"
 */
export const getMediaUrl = (path: string): string => {
  const origin = new URL(import.meta.env.VITE_API_BASE_URL).origin;
  return path.startsWith("/media/") ? `${origin}${path}` : path;
};

/**
 * Devuelve solo el origen (scheme + host + port) de VITE_API_BASE_URL.
 *
 * @example
 * getApiOrigin()
 * // => "https://api.avakanta.com"
 */
export const getApiOrigin = (): string =>
  new URL(import.meta.env.VITE_API_BASE_URL).origin;
