# Manual de Usuario - SIGMA CRM

## 1. Introducción

SIGMA CRM es una aplicación web diseñada para la gestión de proyectos y personal. Permite a los usuarios visualizar, filtrar y gestionar información sobre los proyectos y el personal de la organización. La aplicación también proporciona herramientas de visualización de datos, como gráficos, para facilitar el análisis de la información.

Este manual proporciona una guía detallada sobre cómo utilizar todas las funcionalidades de SIGMA CRM.

### Tecnologías

La aplicación está construida con las siguientes tecnologías:

-   **Frontend:** Next.js (React), TypeScript, Tailwind CSS
-   **Backend:** Next.js API Routes, Prisma ORM
-   **Base de datos:** SQLite

## 2. Primeros Pasos

Para ejecutar la aplicación en un entorno de desarrollo, sigue estos pasos:

1.  **Configurar el entorno:**

    Crea un archivo `.env` en la raíz del proyecto y define la variable de entorno `DATABASE_URL`:

    ```
    DATABASE_URL="file:./prisma/dev.db"
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Ejecutar las migraciones de la base de datos:**

    ```bash
    npx prisma migrate dev
    ```

4.  **Iniciar el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

Una vez que el servidor esté en funcionamiento, puedes acceder a la aplicación en tu navegador en la dirección `http://localhost:3010`.

## 3. Funcionalidades Principales

### 3.1. Gestión de Proyectos

La sección de gestión de proyectos te permite visualizar y gestionar toda la información relacionada con los proyectos de la organización.

#### Ver Proyectos

Al acceder a la sección de "Proyectos", verás una tabla con la lista de todos los proyectos. La tabla muestra información clave como el título del proyecto, el cliente, la categoría, la dependencia y el estado.

#### Filtrar y Buscar Proyectos

Puedes filtrar y buscar proyectos utilizando los controles situados encima de la tabla. Puedes buscar por título o descripción, y filtrar por Tier, Estado, Salud, Prioridad y Área.

**Ejemplo de consulta con filtros:**

Una búsqueda de proyectos con el `tier` "1" y el `estado` "en desarrollo" resultará en una URL como la siguiente:

```
http://localhost:3010/proyectos?tier=1&estado=en%20desarrollo
```

#### Ver Gráficos de Proyectos

Puedes visualizar gráficos que resumen la información de los proyectos haciendo clic en el botón "Mostrar Gráficos". Esto te permitirá ver distribuciones por Tier, Área, Estado, Salud y Prioridad.

#### Seleccionar Columnas Visibles

Puedes personalizar las columnas que se muestran en la tabla de proyectos haciendo clic en el botón "Seleccionar Columnas" y marcando las columnas que deseas ver.

#### Crear, Editar y Eliminar Proyectos

-   **Crear:** Haz clic en el botón "Crear Proyecto" para acceder al formulario de creación de un nuevo proyecto.
-   **Editar:** Haz clic en el icono del lápiz en la fila de un proyecto para editar su información.
-   **Eliminar:** Haz clic en el icono de la papelera en la fila de un proyecto para eliminarlo.

### 3.2. Gestión de Staff

La sección de gestión de staff te permite visualizar y gestionar toda la información relacionada con el personal de la organización.

#### Ver Personal

Al acceder a la sección de "Staff", verás una tabla con la lista de todo el personal. La tabla muestra información clave como el nombre completo, el email y el rol.

#### Filtrar y Buscar Personal

Puedes filtrar y buscar personal utilizando los controles situados encima de la tabla. Puedes buscar por nombre, email o rol, y filtrar por Rol, Seniority, Tecnología, Contrato y Área.

#### Ver Gráficos de Personal

Puedes visualizar gráficos que resumen la información del personal haciendo clic en el botón "Mostrar Gráficos". Esto te permitirá ver distribuciones por Rol, Seniority, Tecnología, Contrato y Área.

#### Seleccionar Columnas Visibles

Puedes personalizar las columnas que se muestran en la tabla de personal haciendo clic en el botón "Seleccionar Columnas" y marcando las columnas que deseas ver.

#### Crear, Editar y Eliminar Personal

-   **Crear:** Haz clic en el botón "Añadir Persona" para acceder al formulario de creación de un nuevo miembro del personal.
-   **Editar:** Haz clic en el icono del lápiz en la fila de una persona para editar su información.
-   **Eliminar:** Haz clic en el icono de la papelera en la fila de una persona para eliminarla.

## 4. Gestión de la Base de Datos

### 4.1. Persistencia de Datos

La aplicación utiliza una base de datos SQLite para la persistencia de datos. El archivo de la base de datos se encuentra en `prisma/dev.db`. Todos los datos de la aplicación se almacenan en este archivo.

### 4.2. Migraciones

Cualquier cambio en el esquema de la base de datos se gestiona a través de migraciones de Prisma. Para aplicar cualquier cambio en el esquema definido en `prisma/schema.prisma`, ejecuta el siguiente comando:

```bash
npx prisma migrate dev
```

Esto actualizará el esquema de la base de datos y generará un nuevo archivo de migración en el directorio `prisma/migrations`.

### 4.3. Población Masiva de Datos

La aplicación incluye un script para poblar la base de datos masivamente desde un archivo Excel. El script se encuentra en `prisma/migration.ts`.

Para ejecutar el script, utiliza el siguiente comando:

```bash
npx tsx prisma/migration.ts
```

Este script lee el archivo `data.xlsx` del proyecto `dpr-master` y puebla todas las tablas de la base de datos. Puedes adaptar este script para leer datos de otras fuentes o formatos de archivo.

### 4.4. Consultas a la Base de Datos

La aplicación utiliza Prisma ORM para interactuar con la base de datos. Todas las consultas a la base de datos están abstraídas por la API de la aplicación. No es necesario escribir consultas SQL directamente.

Para consultar los datos, puedes utilizar los endpoints de la API documentados en la siguiente sección. Por ejemplo, para obtener una lista de todos los proyectos, puedes hacer una petición `GET` a `/api/proyectos`.

## 5. Referencia de la API

A continuación se muestra un resumen de los endpoints de la API disponibles con ejemplos de uso.

### Proyectos

-   **`GET /api/proyectos`**: Obtiene una lista de todos los proyectos.

    *Ejemplo con `curl`:*

    ```bash
    curl "http://localhost:3010/api/proyectos?tier=1&estado=en%20desarrollo"
    ```

-   **`POST /api/proyectos`**: Crea un nuevo proyecto.

    *Ejemplo con `curl`:*

    ```bash
    curl -X POST http://localhost:3010/api/proyectos -H "Content-Type: application/json" -d '{"titulo": "Nuevo Proyecto", "storyline": "Descripción del nuevo proyecto"}'
    ```

-   **`GET /api/proyectos/[id]`**: Obtiene un proyecto específico por su ID.

    *Ejemplo con `curl`:*

    ```bash
    curl http://localhost:3010/api/proyectos/1
    ```

-   **`PUT /api/proyectos/[id]`**: Actualiza un proyecto específico por su ID.

    *Ejemplo con `curl`:*

    ```bash
    curl -X PUT http://localhost:3010/api/proyectos/1 -H "Content-Type: application/json" -d '{"titulo": "Proyecto Actualizado"}'
    ```

-   **`DELETE /api/proyectos/[id]`**: Elimina un proyecto específico por su ID.

    *Ejemplo con `curl`:*

    ```bash
    curl -X DELETE http://localhost:3010/api/proyectos/1
    ```

-   **`GET /api/proyectos/filters`**: Obtiene las opciones de filtro para los proyectos.

    *Ejemplo con `curl`:*

    ```bash
    curl http://localhost:3010/api/proyectos/filters11
    ```

### Staff

-   **`GET /api/staff`**: Obtiene una lista de todo el personal.

    *Ejemplo con `curl`:*

    ```bash
    curl "http://localhost:3010/api/staff?rol_staff=Desarrollador"
    ```

-   **`POST /api/staff`**: Crea un nuevo miembro del personal.

    *Ejemplo con `curl`:*

    ```bash
    curl -X POST http://localhost:3010/api/staff -H "Content-Type: application/json" -d '{"nombre_completo": "Juan Perez", "email": "juan.perez@example.com"}'
    ```

-   **`GET /api/staff/[id]`**: Obtiene un miembro del personal específico por su ID.

    *Ejemplo con `curl`:*

    ```bash
    curl http://localhost:3010/api/staff/1
    ```

-   **`PUT /api/staff/[id]`**: Actualiza un miembro del personal específico por su ID.

    *Ejemplo con `curl`:*

    ```bash
    curl -X PUT http://localhost:3010/api/staff/1 -H "Content-Type: application/json" -d '{"rol_staff": "Lider Tecnico"}'
    ```

-   **`DELETE /api/staff/[id]`**: Elimina un miembro del personal específico por su ID.

    *Ejemplo con `curl`:*

    ```bash
    curl -X DELETE http://localhost:3010/api/staff/1
    ```

-   **`GET /api/staff/filters`**: Obtiene las opciones de filtro para el personal.

    *Ejemplo con `curl`:*

    ```bash
    curl http://localhost:3010/api/staff/filters
    ```
