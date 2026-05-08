import type { Asignatura, Estudiante } from "../domain/types/university.js";

export interface RespuestaAPI<T> {
  codigoEstado: number;
  exito: boolean;
  datos: T;
}

const estudiantes: Estudiante[] = [
  { id: "EST-1", nombre: "Ana", email: "ana@ejemplo.com" },
  { id: "EST-2", nombre: "Luis", email: "luis@ejemplo.com" },
];

const asignaturas: Asignatura[] = [
  { id: "ASG-1", nombre: "TypeScript", creditos: 6 },
  { id: "ASG-2", nombre: "Arquitectura", creditos: 4 },
];

function resolverDatos<T>(endpoint: string): T {
  if (endpoint === "/estudiantes") {
    return estudiantes as T;
  }

  if (endpoint === "/asignaturas") {
    return asignaturas as T;
  }

  return [] as T;
}

export function obtenerRecurso<T>(endpoint: string): Promise<RespuestaAPI<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        codigoEstado: 200,
        exito: true,
        datos: resolverDatos<T>(endpoint),
      });
    }, 150);
  });
}
