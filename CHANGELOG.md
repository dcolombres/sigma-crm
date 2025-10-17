# Historial de Cambios

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato se basa en [Mantén un Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto se adhiere a [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-10-17

### Changed
- **Improved UI/UX:**
    - Homogenized the views for Staff, Clientes, and Integraciones to match the Proyectos view.
    - Improved the main buttons in each section.
    - Replaced the "Editar" and "Eliminar" buttons with icons.
    - Removed all rounded borders from the application.
    - Improved the sidebar style.
    - Improved the search input style.

### Fixed
- **Bugfixes:**
    - Fixed a bug in the Integraciones table where the "Función principal" column would exceed the table width.
    - Fixed a build error in `ProyectosTable.tsx`.
    - Fixed a runtime error in `ProyectosTable.tsx`.
    - Fixed a runtime error in `Pagination.tsx`.

## [1.2.0] - 2025-10-14

### Removed
- **Authentication:** Removed all authentication logic from the application, including the login page, user profiles, and password-protected routes. The application is now fully public.
- **Dependencies:** Removed `next-auth` and `bcryptjs` dependencies.

### Changed
- **Database Schema:** Removed the `User` model and moved the relevant fields to the `Staff` model.

## [1.1.1] - 2025-10-09

### Corregido
- **Estabilidad del Proyecto:** Se solucionaron múltiples errores críticos de construcción y ejecución (`ENOENT`, `Connection closed`, 404 en assets) al bajar la versión de Next.js de una experimental (`v15.5.4`) a una estable (`v14.2.3`).
- **Renderizado de Páginas:** Se corrigió un error de renderizado en el lado del servidor en la página de Proyectos que impedía su carga, causado por un manejo incorrecto de `searchParams`.
- **Interfaz de Usuario:** Se eliminó el componente `Topbar` del layout principal para restaurar la interfaz a la versión deseada por el usuario (solo con sidebar).

## [1.1.0] - 2025-10-02

### Cambiado
- **Refactorización General:** Se refactorizaron las funcionalidades CRUD (Crear, Leer, Actualizar, Eliminar) de las secciones de Proyectos, Staff, Integraciones y Clientes para mejorar la robustez, el manejo de errores y la experiencia de usuario.
    - Se centralizó la lógica de negocio en `src/lib/actions.ts`.
    - Se implementó `useActionState` para un manejo de estado y errores más consistente en los formularios.
    - Se separaron los componentes de servidor y cliente para una arquitectura más limpia.
    - Se crearon funciones de ayuda compartidas para formularios en `src/lib/form-helpers.ts`.
    - Se mejoraron los mensajes de error para el usuario.
- **Seguridad (Hashing de Contraseñas):** Se implementó el hashing de contraseñas utilizando `bcryptjs` para mejorar la seguridad en:
    - La autenticación de usuarios (`src/lib/auth.ts`).
    - La importación inicial de personal (`prisma/import_staff.ts`).
    - La actualización de contraseñas de usuario y credenciales de integración (`src/lib/actions.ts`).
- **Navegación (Breadcrumbs):** Se implementaron breadcrumbs dinámicos que muestran el nombre de la entidad (en lugar del ID numérico) para Proyectos, Staff, Clientes e Integraciones, mejorando la usabilidad.
- **Sección de Clientes:**
    - Se hizo que el nombre del cliente en la tabla fuera clickeable, enlazando a la página de edición.
- **Sección de Staff:**
    - Se hizo que el nombre del miembro del staff en la tabla fuera clickeable, enlazando a la página de edición.
- **Sección de Integraciones:**
    - Se hizo que el nombre de la integración en la tabla fuera clickeable, enlazando a la página de edición.
    - Se implementó la visualización de documentación en formato Markdown en la página de edición, con un botón para alternar entre vista y edición.
    - Se configuró el plugin `@tailwindcss/typography` para un mejor estilo del Markdown.
    - Se ajustó la página de edición de integraciones para que ocupe todo el ancho disponible.
- **Página de Perfil:** Se añadió un formulario para que los usuarios puedan actualizar su contraseña de forma segura.

### Corregido
- **Errores de Compilación:** Se resolvieron varios errores de compilación y de tipos de TypeScript en componentes y acciones del servidor.
- **Errores de Ejecución:** Se corrigió el error "Connection closed" que ocurría al navegar a la página de listado de proyectos, causado por un manejo incorrecto de `searchParams`.
- **Manejo de Errores de Prisma:** Se corrigió la referencia a `PrismaClientKnownRequestError` en las acciones del servidor para un manejo de errores de base de datos más robusto.

## [1.0.0] - 2025-09-25

### Agregado
- **Inicialización del Proyecto:** Se inicializó correctamente el repositorio de Git dentro del directorio del proyecto.
- **Siembra de Datos (Seeding):**
    - Se agregó la siembra de datos para una lista completa de títulos de Proyectos.
    - Se agregó la siembra de datos para un Proyecto de ejemplo completo con todas sus relaciones.
    - Se agregó la siembra de datos para un Cliente y una Integración de ejemplo.
- **Análisis del Dashboard:**
    - Se implementaron cuatro gráficos de estadísticas globales en el Dashboard: Roles de Personal, Infraestructura, Bases de Datos y Tiers.
- **Funcionalidades de Formularios:**
    - Se implementó una entrada de selección múltiple para asignar Proyectos a los miembros del Personal.
    - Se implementaron entradas de selección múltiple para asignar Lenguajes y Bases de Datos a los Proyectos.
    - Se implementó la funcionalidad de eliminación de imágenes para la captura de pantalla del proyecto.

### Cambiado
- **Diseño:** Se refactorizó el diseño de la aplicación de una barra lateral vertical a una barra de navegación superior horizontal.
- **Diseño del Dashboard:**
    - Se cambiaron las tarjetas específicas del usuario (Redmine, IMAP, etc.) a un diseño de una sola columna y ancho completo.
    - Se cambió el gráfico de "Roles de Personal" de un gráfico circular a un gráfico de barras horizontales para una mejor legibilidad.
- **Formulario de Edición de Personal:**
    - Se expandió el formulario para incluir todos los campos del modelo `Staff`.
    - `nombre_completo` ahora se genera automáticamente a partir de `nombres` y `apellidos`.
    - `edad` ahora se calcula automáticamente a partir de la fecha de nacimiento (`cumpleanos`).
- **Formulario de Edición de Proyecto:**
    - Se mejoró la experiencia de usuario para la funcionalidad de carga de capturas de pantalla al mostrar la imagen actual y agregar una opción de eliminación.
- **Estilos:** Se revirtió un intento de revisión mayor de la interfaz de usuario/experiencia de usuario y se restauraron los estilos originales y funcionales como base para el nuevo diseño horizontal.

### Corregido
- **Base de Datos e Inicio de Sesión:**
    - Se resolvieron errores críticos de inicio de sesión y visualización de datos corrigiendo el esquema de la base de datos, limpiando archivos de base de datos duplicados y corrigiendo rutas de variables de entorno incorrectas.
- **Uso de Modelos:**
    - Se corrigió un error recurrente en toda la aplicación (Configuración, API de IMAP, API de CalDAV) donde se utilizaba el modelo `Staff` para consultar la configuración específica del usuario en lugar del modelo `User`.
- **Compilación y Dependencias:**
    - Se resolvieron errores de compilación instalando las dependencias que faltaban (`@mui/x-charts`, `@emotion/react`, `@emotion/styled`).
    - Se corrigieron las rutas de importación incorrectas para los componentes de gráficos.
    - Se corrigió un error de compilación causado por la ubicación incorrecta de la directiva `'use client'` al refactorizar la estructura de los componentes.
- **Integridad de los Datos:**
    - Se corrigió un error donde se utilizaba el campo `rol` en lugar de `rol_staff` en la lista y las páginas de edición del Personal.
    - Se hizo más robusta la lógica de carga de imágenes para evitar que se guardaran valores `null` incorrectos en la base de datos.
- **Navegación:** Se corrigió un error importante de la interfaz de usuario ("íconos gigantes") que hacía que la aplicación fuera inutilizable al revertir los cambios de estilo defectuosos.

### Eliminado
- **Directorios Redundantes:** Se limpiaron los directorios `prisma` anidados e innecesarios.