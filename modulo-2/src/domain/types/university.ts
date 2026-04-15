/**
 * university.ts — Módulo 2
 * Modelado del dominio de un sistema de gestión universitario.
 *
 * Decisiones de diseño:
 * - Se usa `interface` para Estudiante y Asignatura porque son entidades
 *   de dominio jerárquicas orientadas a objetos (declaration merging potencial).
 * - Se usa `type` para EstadoMatricula porque es una unión discriminada:
 *   un tipo compuesto que combina tres interfaces cerradas.
 * - Los IDs son `readonly` para garantizar inmutabilidad post-creación.
 */

// ─── Entidades de dominio ────────────────────────────────────────────────────

export interface Asignatura {
  readonly id: string;
  nombre: string;
  creditos: number;
  departamento: string;
  profesorResponsable: string;
}

export interface Estudiante {
  readonly id: string;
  nombre: string;
  apellidos: string;
  email: string;
  fechaIngreso: Date;
  asignaturas: Asignatura[];
  notaMedia?: number; // Opcional: puede no tener notas aún
}

// ─── Unión discriminada: EstadoMatricula ─────────────────────────────────────
//
// El patrón de unión discriminada usa una propiedad literal compartida (`tipo`)
// como "discriminante". Esto permite a TypeScript estrechar el tipo dentro de
// cualquier bloque condicional, garantizando acceso seguro a propiedades
// exclusivas de cada variante sin necesidad de casting.

export interface MatriculaActiva {
  tipo: "ACTIVA";
  asignaturas: Asignatura[];
  fechaInicio: Date;
}

export interface MatriculaSuspendida {
  tipo: "SUSPENDIDA";
  motivo: string;
  fechaSuspension: Date;
  reactivableEn?: Date; // Fecha estimada de reactivación (opcional)
}

export interface MatriculaFinalizada {
  tipo: "FINALIZADA";
  notaMedia: number;
  fechaFinalizacion: Date;
  titulacionObtenida: string;
}

export type EstadoMatricula =
  | MatriculaActiva
  | MatriculaSuspendida
  | MatriculaFinalizada;

// ─── Función generarReporte ───────────────────────────────────────────────────
//
// Usa switch sobre el discriminante `tipo` para garantizar cobertura total.
// En el Módulo 3 se añadirá el exhaustiveness check con `never`.

export function generarReporte(estado: EstadoMatricula): string {
  switch (estado.tipo) {
    case "ACTIVA":
      return (
        `Matrícula ACTIVA desde ${estado.fechaInicio.toLocaleDateString("es-ES")}. ` +
        `Asignaturas matriculadas: ${estado.asignaturas.length} ` +
        `(${estado.asignaturas.map((a) => a.nombre).join(", ")}).`
      );

    case "SUSPENDIDA":
      return (
        `Matrícula SUSPENDIDA el ${estado.fechaSuspension.toLocaleDateString("es-ES")}. ` +
        `Motivo: ${estado.motivo}.` +
        (estado.reactivableEn
          ? ` Reactivable a partir del ${estado.reactivableEn.toLocaleDateString("es-ES")}.`
          : "")
      );

    case "FINALIZADA":
      return (
        `Matrícula FINALIZADA el ${estado.fechaFinalizacion.toLocaleDateString("es-ES")}. ` +
        `Titulación: ${estado.titulacionObtenida}. ` +
        `Nota media final: ${estado.notaMedia.toFixed(2)}.`
      );
  }
}

// ─── Tipos de utilidad aplicados al dominio ──────────────────────────────────

/** Vista pública de un estudiante (sin datos sensibles de asignaturas) */
export type EstudianteResumen = Pick<Estudiante, "id" | "nombre" | "apellidos" | "email">;

/** Datos necesarios para actualizar un estudiante (PATCH — todos opcionales) */
export type ActualizacionEstudiante = Partial<Omit<Estudiante, "id" | "fechaIngreso">>;

/** Diccionario indexado de estudiantes por su ID */
export type RegistroEstudiantes = Record<string, Estudiante>;
