# Historial de Cambios

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato se basa en [Mantén un Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto se adhiere a [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

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