/**
 * index.ts — Módulo 1
 * Punto de entrada: importa las utilidades matemáticas y ejecuta pruebas
 * con distintos conjuntos de datos para verificar el comportamiento.
 *
 * Ejecutar con: npx tsx src/index.ts
 * Compilar con: npx tsc
 */

import {
  calcularMedia,
  calcularMediana,
  filtrarAtipicos,
  calcularDesviacionEstandar,
} from "./math-utils.js";

// ─── Datos de prueba ────────────────────────────────────────────────────────

const temperaturas: number[] = [22.1, 23.5, 21.8, 99.9, 22.7, 23.1, 20.5, 22.9];
const puntuaciones: number[] = [85, 90, 78, 92, 88, 76, 95, 89, 84, 91];
const arrayVacio: number[] = [];
const unSoloElemento: number[] = [42];

// ─── Helper de impresión ────────────────────────────────────────────────────

function imprimirResultado(etiqueta: string, valor: number | null): void {
  if (valor === null) {
    console.log(`  ${etiqueta}: (array vacío — sin valor)`);
  } else {
    console.log(`  ${etiqueta}: ${valor.toFixed(4)}`);
  }
}

// ─── Temperaturas con un valor atípico (99.9) ───────────────────────────────

console.log("\n=== Temperaturas (°C) ===");
console.log("  Datos:", temperaturas);
imprimirResultado("Media", calcularMedia(temperaturas));
imprimirResultado("Mediana", calcularMediana(temperaturas));
imprimirResultado("Desv. estándar", calcularDesviacionEstandar(temperaturas));

const sinAtipicos = filtrarAtipicos(temperaturas, 2);
console.log("  Filtrado (límite 2σ):", sinAtipicos);

// ─── Puntuaciones ───────────────────────────────────────────────────────────

console.log("\n=== Puntuaciones (0-100) ===");
console.log("  Datos:", puntuaciones);
imprimirResultado("Media", calcularMedia(puntuaciones));
imprimirResultado("Mediana", calcularMediana(puntuaciones));
imprimirResultado("Desv. estándar", calcularDesviacionEstandar(puntuaciones));

// ─── Casos límite ───────────────────────────────────────────────────────────

console.log("\n=== Casos límite ===");

// TypeScript obliga a comprobar null antes de usar el valor
const mediaVacio = calcularMedia(arrayVacio);
if (mediaVacio === null) {
  console.log("  Array vacío: media devuelve null correctamente");
}

const mediaSolo = calcularMedia(unSoloElemento);
if (mediaSolo !== null) {
  console.log(`  Un solo elemento [${unSoloElemento}]: media = ${mediaSolo}`);
}

console.log(
  "  filtrarAtipicos([42], 2):",
  filtrarAtipicos(unSoloElemento, 2)
);

// ─── Demostración de inferencia de tipos ────────────────────────────────────

console.log("\n=== Tipos en tiempo de ejecución ===");

let identificador: string = "USR-492";
let iteraciones: number = 10;
let procesoActivo: boolean = true;
const timestamp = new Date().getTime(); // TypeScript infiere number

console.log({ identificador, iteraciones, procesoActivo, timestamp });

// Tupla: posición geográfica con tipos heterogéneos
const coordenada: [number, number, number] = [40.4168, -3.7038, 600];
console.log("  Coordenada [lat, lon, alt]:", coordenada);
