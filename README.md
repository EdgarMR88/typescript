# TypeScript — Fase 4

Repositorio de los **Módulos 1 y 2** de la Fase 4: TypeScript con tipado estricto, genéricos y modelado de dominio.

## Estructura

```
typescript/
  modulo-1/        Lógica pura: funciones estadísticas tipadas
    src/
      math-utils.ts   Funciones calcularMedia, calcularMediana, filtrarAtipicos
      index.ts        Punto de entrada con datos de prueba
    dist/           Código JavaScript generado por tsc
    docs/
  modulo-2/        Modelado de dominio y genéricos
    src/
      domain/types/
        university.ts  Interfaces de dominio y unión discriminada EstadoMatricula
      services/
        api-client.ts  obtenerRecurso<T> y tipo genérico RespuestaAPI<T>
      index.ts
    docs/
      modelo-datos.md  Decisiones de arquitectura y diseño
```

## Cómo ejecutar

### Módulo 1

```bash
cd modulo-1
npm install
npx tsx src/index.ts     # Ejecutar directamente
npx tsc                  # Compilar a dist/
npx tsc --noEmit         # Verificar tipos sin compilar
```

### Módulo 2

```bash
cd modulo-2
npm install
npx tsx src/index.ts
npx tsc --noEmit
```

## Conceptos cubiertos

**Módulo 1**
- Tipos primitivos e inferencia
- `number | null` para manejo de casos límite
- Firmas de función estrictas
- Tuplas y arrays tipados
- `as const` y ensanchamiento de tipos

**Módulo 2**
- `interface` vs `type`: cuándo usar cada uno
- Uniones discriminadas con propiedad literal (`tipo`)
- Tipos de utilidad: `Partial`, `Pick`, `Omit`, `Record`
- Programación genérica: `RespuestaAPI<T>`, `obtenerRecurso<T>`
- Restricciones genéricas con `extends`
