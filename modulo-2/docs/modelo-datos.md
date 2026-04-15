# Módulo 2 — Modelo de datos y decisiones de arquitectura

## Entidades del dominio

El sistema modela un **gestor universitario** con dos entidades principales:

### `Asignatura`

Representa una materia académica con su carga en créditos y el departamento responsable.

```typescript
interface Asignatura {
  readonly id: string;
  nombre: string;
  creditos: number;
  departamento: string;
  profesorResponsable: string;
}
```

### `Estudiante`

Entidad central del dominio. Contiene información de contacto y una relación de composición con `Asignatura[]`.

```typescript
interface Estudiante {
  readonly id: string;
  nombre: string;
  apellidos: string;
  email: string;
  fechaIngreso: Date;
  asignaturas: Asignatura[];
  notaMedia?: number;
}
```

El campo `notaMedia` es opcional (`?`) porque un estudiante recién matriculado puede no tener notas todavía.

---

## Por qué `interface` y no `type` para las entidades

La regla de diseño aplicada es:

| Construcción | Cuándo usarla |
|---|---|
| `interface` | Entidades de dominio orientadas a objetos, estructuras jerárquicas, contratos de clase |
| `type` | Uniones, intersecciones, alias de primitivos, funciones |

`Estudiante` y `Asignatura` son entidades de negocio con identidad propia. Usar `interface` permite **declaration merging** si en el futuro una capa de persistencia necesita extenderlas, y expresa mejor la intención de "contrato de objeto".

---

## Unión discriminada: `EstadoMatricula`

```typescript
type EstadoMatricula = MatriculaActiva | MatriculaSuspendida | MatriculaFinalizada
```

Aquí sí se usa `type` porque es una unión — una construcción que combina varios tipos independientes. Cada variante tiene una propiedad literal `tipo` que actúa como **discriminante**:

```typescript
interface MatriculaActiva    { tipo: "ACTIVA";     asignaturas: Asignatura[] }
interface MatriculaSuspendida { tipo: "SUSPENDIDA"; motivo: string }
interface MatriculaFinalizada { tipo: "FINALIZADA"; notaMedia: number }
```

### Ventaja frente a propiedades opcionales

Sin discriminación, el modelo tendría propiedades opcionales ambiguas:

```typescript
// ❌ Modelo ambiguo: ¿qué combinación de propiedades es válida?
interface MatriculaMala {
  estado: string;
  asignaturas?: Asignatura[];
  motivo?: string;
  notaMedia?: number;
}
```

Con la unión discriminada, TypeScript estrecha el tipo en cada rama del `switch`, garantizando que `asignaturas` solo existe en `ACTIVA` y `notaMedia` solo en `FINALIZADA`.

---

## Genéricos: `RespuestaAPI<T>`

```typescript
interface RespuestaAPI<T> {
  codigoEstado: number;
  exito: boolean;
  datos: T;
  errores?: string[];
  timestamp: string;
}
```

El genérico `T` parametriza el campo `datos`. Esto significa que la misma interfaz describe respuestas de diferentes recursos sin perder tipado:

```typescript
RespuestaAPI<Estudiante[]>   // datos es Estudiante[]
RespuestaAPI<Asignatura>     // datos es Asignatura
RespuestaAPI<EstudianteResumen[]>  // datos es una vista reducida
```

Sin genéricos, habría que crear una interfaz de respuesta por cada tipo de recurso o usar `any`, perdiendo toda la seguridad de tipos.

### Restricción en `obtenerRecurso<T>`

```typescript
async obtenerRecurso<T>(endpoint: string): Promise<RespuestaAPI<T>>
```

El `T` del método se infiere en el punto de llamada, no en la clase. Esto permite usar un mismo cliente para cualquier tipo de recurso, con inferencia automática en la cadena de uso:

```typescript
const { datos } = await cliente.obtenerRecurso<Estudiante[]>("/estudiantes");
// datos: Estudiante[]  — TypeScript lo sabe sin anotación adicional
```

---

## Tipos de utilidad aplicados

| Tipo | Uso en el proyecto |
|---|---|
| `Pick<Estudiante, "id" \| "nombre" \| "apellidos" \| "email">` | Vista pública sin datos académicos sensibles |
| `Partial<Omit<Estudiante, "id" \| "fechaIngreso">>` | Payload de actualización (PATCH) — todos los campos opcionales |
| `Record<string, Estudiante>` | Diccionario para búsqueda O(1) por ID |

`Partial` elimina la necesidad de duplicar la interfaz con todos los campos marcados como opcionales. `Omit` excluye campos que no deben actualizarse (ID e fecha de ingreso son inmutables por diseño).
