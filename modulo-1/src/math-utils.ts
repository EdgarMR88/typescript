/**
 * math-utils.ts — Módulo 1
 * Funciones de análisis estadístico con tipado estricto.
 *
 * Todas las funciones devuelven `number | null` cuando el array de entrada
 * puede estar vacío, obligando al consumidor a manejar el caso nulo
 * en tiempo de compilación (strictNullChecks).
 */

/**
 * Calcula la media aritmética de un array de números.
 * Retorna null si el array está vacío.
 */
export function calcularMedia(datos: number[]): number | null {
  if (datos.length === 0) return null;
  const suma = datos.reduce((acum, valor) => acum + valor, 0);
  return suma / datos.length;
}

/**
 * Calcula la mediana de un array de números.
 * La mediana es el valor central cuando los datos están ordenados;
 * si hay número par de elementos, se promedian los dos centrales.
 * Retorna null si el array está vacío.
 */
export function calcularMediana(datos: number[]): number | null {
  if (datos.length === 0) return null;

  // Ordenamos una copia para no mutar el array original
  const ordenados = [...datos].sort((a, b) => a - b);
  const mitad = Math.floor(ordenados.length / 2);

  if (ordenados.length % 2 !== 0) {
    return ordenados[mitad] as number;
  }

  const inferior = ordenados[mitad - 1] as number;
  const superior = ordenados[mitad] as number;
  return (inferior + superior) / 2;
}

/**
 * Filtra los valores atípicos (outliers) de un array.
 * Un valor es atípico si su distancia respecto a la media supera
 * el número de desviaciones estándar indicado en `limite`.
 *
 * Si el array está vacío o tiene un solo elemento, lo devuelve tal cual
 * (sin valores que comparar).
 *
 * @param datos   - Array de números a filtrar.
 * @param limite  - Número de desviaciones estándar permitidas (p.ej. 2.0).
 */
export function filtrarAtipicos(datos: number[], limite: number): number[] {
  if (datos.length <= 1) return [...datos];

  const media = calcularMedia(datos) as number; // length > 0, nunca null

  const varianza =
    datos.reduce((acum, valor) => acum + Math.pow(valor - media, 2), 0) /
    datos.length;
  const desviacionEstandar = Math.sqrt(varianza);

  // Si todos los valores son iguales la desviación es 0; devolvemos tal cual
  if (desviacionEstandar === 0) return [...datos];

  return datos.filter(
    (valor) => Math.abs(valor - media) <= limite * desviacionEstandar
  );
}

/**
 * Calcula la desviación estándar de un array de números.
 * Retorna null si el array está vacío.
 */
export function calcularDesviacionEstandar(datos: number[]): number | null {
  if (datos.length === 0) return null;
  const media = calcularMedia(datos) as number;
  const varianza =
    datos.reduce((acum, valor) => acum + Math.pow(valor - media, 2), 0) /
    datos.length;
  return Math.sqrt(varianza);
}
