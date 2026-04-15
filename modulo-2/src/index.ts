/**
 * index.ts — Módulo 2
 * Punto de entrada: demuestra el uso de los tipos de dominio,
 * la unión discriminada y el cliente API genérico.
 *
 * Ejecutar con: npx tsx src/index.ts
 */

import {
  generarReporte,
  type EstadoMatricula,
  type MatriculaActiva,
  type MatriculaSuspendida,
  type MatriculaFinalizada,
} from "./domain/types/university.js";

import {
  ApiCliente,
  RepositorioEstudiantes,
  RepositorioAsignaturas,
} from "./services/api-client.js";

// ─── Demostración de la unión discriminada ────────────────────────────────────

console.log("\n=== Unión Discriminada: EstadoMatricula ===\n");

const estadoActivo: MatriculaActiva = {
  tipo: "ACTIVA",
  fechaInicio: new Date("2024-09-15"),
  asignaturas: [
    {
      id: "ASG-001",
      nombre: "Cálculo I",
      creditos: 6,
      departamento: "Matemáticas",
      profesorResponsable: "Dr. García",
    },
    {
      id: "ASG-002",
      nombre: "Programación I",
      creditos: 6,
      departamento: "Informática",
      profesorResponsable: "Dra. Martínez",
    },
  ],
};

const estadoSuspendido: MatriculaSuspendida = {
  tipo: "SUSPENDIDA",
  motivo: "Impago de tasas académicas",
  fechaSuspension: new Date("2025-01-10"),
  reactivableEn: new Date("2025-03-01"),
};

const estadoFinalizado: MatriculaFinalizada = {
  tipo: "FINALIZADA",
  notaMedia: 8.75,
  fechaFinalizacion: new Date("2027-06-30"),
  titulacionObtenida: "Grado en Ingeniería Informática",
};

const estados: EstadoMatricula[] = [estadoActivo, estadoSuspendido, estadoFinalizado];

estados.forEach((estado) => {
  console.log(`[${estado.tipo}]`, generarReporte(estado));
});

// ─── Demostración del cliente API genérico ────────────────────────────────────

async function main(): Promise<void> {
  console.log("\n=== Cliente API Genérico ===\n");

  const cliente = new ApiCliente();
  const repoEstudiantes = new RepositorioEstudiantes(cliente);
  const repoAsignaturas = new RepositorioAsignaturas(cliente);

  // GET todos los estudiantes
  const { datos: estudiantes } = await repoEstudiantes.obtenerTodos();
  console.log(`\nEstudiantes (${estudiantes.length}):`);
  estudiantes.forEach((e) =>
    console.log(`  - ${e.nombre} ${e.apellidos} <${e.email}>`)
  );

  // GET un estudiante por ID
  const { datos: estudiante, codigoEstado } =
    await repoEstudiantes.obtenerPorId("EST-001");
  console.log(`\nEstudiante EST-001 (HTTP ${codigoEstado}):`);
  console.log(`  Nota media: ${estudiante.notaMedia?.toFixed(2) ?? "sin notas"}`);
  console.log(
    `  Asignaturas: ${estudiante.asignaturas.map((a) => a.nombre).join(", ")}`
  );

  // GET resúmenes (datos parciales con Pick)
  const { datos: resumenes } = await repoEstudiantes.obtenerResumenes();
  console.log("\nResúmenes (Pick<Estudiante, id|nombre|apellidos|email>):");
  resumenes.forEach((r) => console.log(`  - [${r.id}] ${r.nombre} ${r.apellidos}`));

  // GET asignaturas
  const { datos: asignaturas } = await repoAsignaturas.obtenerTodas();
  console.log(`\nAsignaturas (${asignaturas.length}):`);
  asignaturas.forEach((a) =>
    console.log(`  - ${a.nombre} (${a.creditos} cr.) — ${a.departamento}`)
  );

  // GET recurso inexistente → error controlado
  console.log("\nIntento de acceso a recurso inexistente:");
  try {
    await cliente.obtenerRecurso("/cursos");
  } catch (err) {
    if (err instanceof Error) {
      console.log(`  Error capturado: ${err.name} — ${err.message}`);
    }
  }
}

main().catch(console.error);
