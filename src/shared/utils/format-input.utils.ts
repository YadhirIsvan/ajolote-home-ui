/**
 * Utilidades de formato para inputs numéricos.
 * Todas las funciones reciben el string crudo del input y devuelven el valor formateado para mostrar.
 * Para guardar/enviar al backend, usar `parseRawNumber` para obtener el valor limpio.
 */

/** Elimina todo excepto dígitos */
export const parseRawNumber = (value: string): string =>
  value.replace(/[^0-9]/g, "");

/** Elimina todo excepto dígitos y punto decimal */
export const parseRawDecimal = (value: string): string =>
  value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

/**
 * Formatea un string numérico con separador de miles.
 * "1234567" → "1,234,567"
 */
export const formatMoney = (value: string): string => {
  const raw = parseRawNumber(value);
  if (!raw) return "";
  return Number(raw).toLocaleString("en-US");
};

/**
 * Formatea metros cuadrados con separador de miles (permite decimales).
 * "1234.5" → "1,234.5"
 */
export const formatSqm = (value: string): string => {
  const raw = parseRawDecimal(value);
  if (!raw) return "";
  const [intPart, decPart] = raw.split(".");
  const formatted = Number(intPart).toLocaleString("en-US");
  return decPart !== undefined ? `${formatted}.${decPart}` : formatted;
};

/**
 * Formatea teléfono mexicano: 2721234567 → 272 123 4567
 * Si empieza con +52 lo preserva.
 */
export const formatPhone = (value: string): string => {
  const raw = value.replace(/[^0-9+]/g, "");

  // Si tiene prefijo +52
  if (raw.startsWith("+52")) {
    const digits = raw.slice(3);
    return "+52 " + formatPhoneDigits(digits);
  }
  if (raw.startsWith("+")) {
    return raw; // otro país, no formatear
  }
  return formatPhoneDigits(raw);
};

const formatPhoneDigits = (digits: string): string => {
  const d = digits.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
};
