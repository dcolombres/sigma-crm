# Cómo Modificar Campos Desplegables en SIGMA CRM

Este documento explica el procedimiento para agregar, modificar o eliminar opciones en los campos desplegables de la aplicación (como 'Dependencia', 'Categoría', 'Lenguaje', etc.).

## Resumen del Proceso

La mayoría de los campos desplegables de la aplicación se alimentan de "tablas de consulta" (lookup tables) en la base de datos. La forma correcta y centralizada de gestionar los datos en estas tablas es a través del script de "seeding" de Prisma, que se encuentra en `prisma/seed.ts`.

Modificar este archivo asegura que los cambios sean consistentes para todos los desarrolladores y en todos los entornos.

## Pasos para Modificar un Campo Desplegable

Sigue estos pasos para agregar una nueva opción a un campo. Usaremos **'Dependencia'** como ejemplo.

### 1. Identificar la Tabla y el Modelo

Primero, identifica qué modelo de Prisma corresponde al campo que quieres modificar. En este caso, para 'Dependencia Origen' o 'Dependencia Actual', el modelo es `Dependencia`.

### 2. Editar el Archivo `prisma/seed.ts`

Abre el archivo `prisma/seed.ts` en tu editor de código. Busca la sección correspondiente al modelo que quieres modificar. Para nuestro ejemplo, es la sección `// Seed Dependencias`.

```typescript
// prisma/seed.ts

// ...

  // Seed Dependencias
  const dependencias = [
    'Industria', 'Pyme', 'Produccion', 'Energia', 'Mineria', 'Magyp', 'Inti', 'INPI', 'Ec del Conocimiento', 'Comercio', 'Pesca', 'otro'
  ];
  for (const nombre of dependencias) {
// ...
```

### 3. Agregar la Nueva Opción

Para agregar una nueva dependencia, simplemente añade el nuevo nombre como un string al array `dependencias`.

**Ejemplo:** Para agregar 'Secretaría de Innovación':

```typescript
  const dependencias = [
    'Industria', 'Pyme', 'Produccion', 'Energia', 'Mineria', 'Magyp', 'Inti', 'INPI', 'Ec del Conocimiento', 'Comercio', 'Pesca', 'otro', 'Secretaría de Innovación'
  ];
```

El mismo procedimiento se aplica para otros campos como `categorias`, `lenguajes`, `statusPmo`, etc.

### 4. Ejecutar el Script de Seed

Después de guardar los cambios en `prisma/seed.ts`, abre una terminal en la raíz del proyecto (`sigma-crm`) y ejecuta el siguiente comando:

```bash
npx prisma db seed
```

Este comando hará lo siguiente:
- Se conectará a tu base de datos de desarrollo.
- Verificará cada entrada en los arrays del `seed.ts`.
- Si una entrada no existe en la base de datos, la creará. Si ya existe, no hará nada (gracias a `prisma.dependencia.upsert`).

Una vez que el comando termine, la nueva opción estará disponible en los desplegables de la aplicación.

## Para Eliminar o Modificar Opciones

El script `seed.ts` está diseñado principalmente para **agregar** datos de forma segura.

- **Para modificar un nombre:** Es mejor cambiarlo directamente en el array del `seed.ts` y volver a ejecutar el `seed`. Sin embargo, esto creará una nueva entrada y no eliminará la antigua. La forma correcta sería escribir un script de migración, pero para desarrollo, puedes ajustarlo directamente en la base de datos con Prisma Studio (`npx prisma studio`).
- **Para eliminar una opción:** La forma más segura es hacerlo directamente en la base de datos, preferiblemente con Prisma Studio (`npx prisma studio`), para evitar problemas de integridad de datos si la opción ya está siendo usada por algún proyecto.


## Migrations

"db:migrate:dpr": "npx tsx prisma/migrate_dpr.ts",                                                                 │
"db:migrate:sigma": "npx tsx prisma/migrate_sigma.ts",                                                             │
"db:migrate:staff": "npx tsx prisma/migrate_staff.ts",