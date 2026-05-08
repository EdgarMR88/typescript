import {
  generarReporte,
  type EstadoMatricula,
} from "./domain/types/university.js";
import { obtenerRecurso } from "./services/api-client.js";

const estado: EstadoMatricula = {
  tipo: "ACTIVA",
  asignaturas: [
    { id: "ASG-1", nombre: "TypeScript", creditos: 6 },
    { id: "ASG-2", nombre: "Arquitectura", creditos: 4 },
  ],
};

console.log(generarReporte(estado));

async function main(): Promise<void> {
  const respuesta = await obtenerRecurso<{ id: string; nombre: string; email: string }[]>(
    "/estudiantes"
  );

  console.log("Estudiantes:", respuesta.datos);
}

main().catch((error) => {
  console.error("Error:", error);
});
