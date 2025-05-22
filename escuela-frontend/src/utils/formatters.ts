/**
 * Formatea una fecha en el formato especificado
 * @param dateString Fecha en formato string (ISO o cualquier formato válido para Date)
 * @param format Formato de salida: 'dd/MM/yyyy', 'yyyy-MM-dd', etc.
 * @returns Fecha formateada según el formato especificado
 */
export function formatDate(dateString: string, format: string = 'dd/MM/yyyy'): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    return '';
  }
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  // Reemplazar los tokens en el formato
  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year.toString());
}

/**
 * Formatea un número como moneda
 * @param value Valor numérico
 * @param currency Símbolo de moneda (por defecto: ₡)
 * @returns Valor formateado como moneda
 */
export function formatCurrency(value: number, currency: string = '₡'): string {
  return `${currency} ${value.toLocaleString('es-CR')}`;
}

/**
 * Trunca un texto a una longitud máxima y añade puntos suspensivos si es necesario
 * @param text Texto a truncar
 * @param maxLength Longitud máxima
 * @returns Texto truncado
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
