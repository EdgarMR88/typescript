/**
 * api-client.ts — Módulo 2
 * Servicio de acceso a datos genérico que simula llamadas a una base de datos
 * mediante `setTimeout` y Promesas, sin dependencias externas.
 *
 * Patrón clave: el método `obtenerRecurso<T>` usa un genérico para que el
 * resultado de cada llamada esté fuertemente tipado en el punto de uso.
 * El contrato de respuesta (RespuestaAPI<T>) es independiente del recurso.
 */

import type {
  Estudiante,
  Asignatura,
  EstudianteResumen,
} from "../domain/types/university.js";

// ─── Contrato de respuesta genérica ──────────────────────────────────────────
//
// RespuestaAPI<T> parametriza el payload (`datos`) con el tipo concreto
// que espera cada llamada. Esto evita usar `any` y preserva la inferencia
// en toda la cadena de llamadas.

export interface RespuestaAPI<T> {
  codigoEstado: number;
  exito: boolean;
  datos: T;
  errores?: string[];
  timestamp: string;
}

// ─── Tipos de error ───────────────────────────────────────────────────────────

export class ErrorApi extends Error {
  constructor(
    public readonly codigoEstado: number,
    mensaje: string
  ) {
    super(mensaje);
    this.name = "ErrorApi";
  }
}

// ─── Base de datos simulada en memoria ───────────────────────────────────────

const BD_ASIGNATURAS: Asignatura[] = [
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
  {
    id: "ASG-003",
    nombre: "Física I",
    creditos: 6,
    departamento: "Física",
    profesorResponsable: "Dr. López",
  },
];

const BD_ESTUDIANTES: Estudiante[] = [
  {
    id: "EST-001",
    nombre: "Ana",
    apellidos: "Rodríguez Pérez",
    email: "ana.rodriguez@universidad.es",
    fechaIngreso: new Date("2023-09-01"),
    asignaturas: [BD_ASIGNATURAS[0]!, BD_ASIGNATURAS[1]!],
    notaMedia: 8.4,
  },
  {
    id: "EST-002",
    nombre: "Carlos",
    apellidos: "Fernández Díaz",
    email: "carlos.fernandez@universidad.es",
    fechaIngreso: new Date("2022-09-01"),
    asignaturas: [BD_ASIGNATURAS[1]!, BD_ASIGNATURAS[2]!],
    notaMedia: 7.1,
  },
];

// ─── Función auxiliar: simula latencia de red ────────────────────────────────

function simularLatencia(ms: number = 80): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function crearRespuesta<T>(datos: T, codigoEstado = 200): RespuestaAPI<T> {
  return {
    codigoEstado,
    exito: codigoEstado >= 200 && codigoEstado < 300,
    datos,
    timestamp: new Date().toISOString(),
  };
}

// ─── Cliente API genérico ─────────────────────────────────────────────────────

export class ApiCliente {
  private readonly urlBase: string;

  constructor(urlBase = "http://localhost:3000/api/v1") {
    this.urlBase = urlBase;
  }

  /**
   * Método genérico principal.
   * El tipo T se infiere en el punto de llamada:
   *   await cliente.obtenerRecurso<Estudiante[]>("/estudiantes")
   *   → RespuestaAPI<Estudiante[]>
   */
  async obtenerRecurso<T>(endpoint: string): Promise<RespuestaAPI<T>> {
    await simularLatencia();
    console.log(`  [GET] ${this.urlBase}${endpoint}`);

    const recurso = this.resolverEndpoint<T>(endpoint);

    if (recurso === null) {
      throw new ErrorApi(404, `Recurso no encontrado: ${endpoint}`);
    }

    return crearRespuesta(recurso);
  }

  async crearRecurso<T, B>(endpoint: string, cuerpo: B): Promise<RespuestaAPI<T>> {
    await simularLatencia();
    console.log(`  [POST] ${this.urlBase}${endpoint}`, cuerpo);
    // Simulación: devuelve el cuerpo con un ID asignado
    const nuevaEntidad = { id: `NEW-${Date.now()}`, ...cuerpo } as unknown as T;
    return crearRespuesta(nuevaEntidad, 201);
  }

  async actualizarRecurso<T>(
    endpoint: string,
    cambios: Partial<T>
  ): Promise<RespuestaAPI<T>> {
    await simularLatencia();
    console.log(`  [PATCH] ${this.urlBase}${endpoint}`, cambios);
    const actual = this.resolverEndpoint<T>(endpoint);
    if (actual === null) throw new ErrorApi(404, `Recurso no encontrado: ${endpoint}`);
    const actualizado = { ...(actual as object), ...(cambios as object) } as T;
    return crearRespuesta(actualizado);
  }

  async eliminarRecurso(endpoint: string): Promise<void> {
    await simularLatencia();
    console.log(`  [DELETE] ${this.urlBase}${endpoint}`);
  }

  /** Resuelve el endpoint contra la BD simulada en memoria */
  private resolverEndpoint<T>(endpoint: string): T | null {
    if (endpoint === "/estudiantes") return BD_ESTUDIANTES as unknown as T;
    if (endpoint === "/asignaturas") return BD_ASIGNATURAS as unknown as T;

    const matchEstudiante = endpoint.match(/^\/estudiantes\/([^/]+)$/);
    if (matchEstudiante) {
      const id = matchEstudiante[1];
      const encontrado = BD_ESTUDIANTES.find((e) => e.id === id);
      return (encontrado ?? null) as T | null;
    }

    return null;
  }
}

// ─── Repositorios especializados ─────────────────────────────────────────────
//
// Los repositorios envuelven ApiCliente con métodos semánticamente claros
// y tipos concretos, ocultando los genéricos al consumidor final.

export class RepositorioEstudiantes {
  constructor(private readonly cliente: ApiCliente) {}

  async obtenerTodos(): Promise<RespuestaAPI<Estudiante[]>> {
    return this.cliente.obtenerRecurso<Estudiante[]>("/estudiantes");
  }

  async obtenerPorId(id: string): Promise<RespuestaAPI<Estudiante>> {
    return this.cliente.obtenerRecurso<Estudiante>(`/estudiantes/${id}`);
  }

  async actualizar(
    id: string,
    cambios: Partial<Omit<Estudiante, "id" | "fechaIngreso">>
  ): Promise<RespuestaAPI<Estudiante>> {
    return this.cliente.actualizarRecurso<Estudiante>(`/estudiantes/${id}`, cambios);
  }

  async obtenerResumenes(): Promise<RespuestaAPI<EstudianteResumen[]>> {
    const respuesta = await this.cliente.obtenerRecurso<Estudiante[]>("/estudiantes");
    const resumenes: EstudianteResumen[] = respuesta.datos.map(
      ({ id, nombre, apellidos, email }) => ({ id, nombre, apellidos, email })
    );
    return crearRespuesta(resumenes);
  }
}

export class RepositorioAsignaturas {
  constructor(private readonly cliente: ApiCliente) {}

  async obtenerTodas(): Promise<RespuestaAPI<Asignatura[]>> {
    return this.cliente.obtenerRecurso<Asignatura[]>("/asignaturas");
  }
}
