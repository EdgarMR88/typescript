import { calcularMedia, calcularMediana, filtrarAtipicos } from "./math-utils.js";

const datos: number[] = [10, 12, 11, 50, 9, 10, 12];
const vacio: number[] = [];

console.log("Datos:", datos);
console.log("Media:", calcularMedia(datos));
console.log("Mediana:", calcularMediana(datos));
console.log("Sin atípicos (límite 2):", filtrarAtipicos(datos, 2));

console.log("Media array vacío:", calcularMedia(vacio));
console.log("Mediana array vacío:", calcularMediana(vacio));
