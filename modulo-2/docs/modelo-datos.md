# Módulo 2 — Modelo y decisiones

## Entidades

Se definen dos interfaces principales:

- `Estudiante`
- `Asignatura`

En ambos casos, el campo `id` es `readonly` para evitar cambios accidentales.

## Estado de matrícula

Se usa una unión discriminada `EstadoMatricula` con tres variantes exactas:

- `MatriculaActiva` (`tipo: "ACTIVA"` + `asignaturas`)
- `MatriculaSuspendida` (`tipo: "SUSPENDIDA"` + `motivo`)
- `MatriculaFinalizada` (`tipo: "FINALIZADA"` + `notaMedia`)

Esto permite usar `switch` de forma clara y segura en `generarReporte`.

## Interface vs type

- `interface`: para entidades de dominio (objetos con estructura estable).
- `type`: para componer la unión discriminada.

## Genéricos

`RespuestaAPI<T>` permite tipar el campo `datos` según el recurso solicitado.

La función `obtenerRecurso<T>(endpoint)` devuelve `Promise<RespuestaAPI<T>>` y simula una llamada asíncrona con `setTimeout`.
