/**
 * math-utils.ts — Módulo 1
 * Funciones estadísticas simples y tipadas.
 */

export function calcularMedia(array: number[]): number | null {
  if (array.length === 0) return null;
  const suma = array.reduce((acumulado, valor) => acumulado + valor, 0);
  return suma / array.length;
}

export function calcularMediana(array: number[]): number | null {
  if (array.length === 0) return null;

  const ordenado = [...array].sort((a, b) => a - b);
  const mitad = Math.floor(ordenado.length / 2);

  if (ordenado.length % 2 === 0) {
    return (ordenado[mitad - 1] + ordenado[mitad]) / 2;
  }

  return ordenado[mitad];
}

export function filtrarAtipicos(array: number[], limite: number): number[] {
  if (array.length <= 1) return [...array];

  const media = calcularMedia(array);
  if (media === null) return [];

  const varianza =
    array.reduce((acumulado, valor) => acumulado + (valor - media) ** 2, 0) /
    array.length;

  const desviacionEstandar = Math.sqrt(varianza);
  if (desviacionEstandar === 0) return [...array];

  return array.filter(
    (valor) => Math.abs(valor - media) <= limite * desviacionEstandar
  );
}
