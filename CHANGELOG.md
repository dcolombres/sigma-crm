# Historial de Cambios

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato se basa en [Mantén un Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto se adhiere a [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2025-10-30

### Added
- **Project Data Import:** Implemented a script to import project data from a Google Sheet, including all related fields and relationships.
- **Project Subsections:** Added new tabs and forms for "Tecnología", "Backend", "Frontend", and "Base de Datos" in the project details view.
- **Node.js Versioning:** Added a `.nvmrc` file to enforce a specific Node.js version (`18.20.0`) for the project.

### Changed
- **Database Schema:**
    - Refactored the relationship between `Proyecto` and `Cliente` to be one-to-many (a client can have many projects).
    - Added numerous new fields to the `Proyecto` model to match the data from the Google Sheet.
- **UI/UX:**
    - Updated the "General" tab in the project edit form to include all new fields from the Google Sheet.
    - Replaced text inputs with dropdowns and multi-selects for relational data (e.g., Cliente, Responsable, Equipo).
    - Implemented a read-only "STACK" field that is computed from other fields.

### Fixed
- **Build Errors:** Fixed a large number of build errors and type errors related to the new schema changes and form implementations.
- **Data Fetching:** Corrected data fetching logic to use the new database schema and relations.
- **Obsolete Code:** Removed obsolete forms, pages, and UI elements related to the old "Integraciones" and "Cliente-Proyecto" association logic.

### Removed
- **"Integraciones" Section:** Removed the entire "Integraciones" section, including pages, components, and sidebar links.
- **Obsolete "Cliente-Proyecto" Form:** Removed the obsolete form and page for associating a project with a client.

## [1.4.0] - 2025-10-24

### Added
- **Integración de Módulo DPR:** Se ha integrado el proyecto `dpr-master` como un módulo dentro de `sigma-crm` para centralizar la gestión y el desarrollo.

### Changed
- **Reorganización Estructural:** Se movió el directorio `dpr-master` a `sigma-crm/dpr-master`, consolidando la estructura de archivos del proyecto.

### Refactor
- **Planificación de UI:** Se ha definido la creación de una nueva sección en la interfaz de usuario llamada "Gestión". Esta sección albergará la funcionalidad del módulo DPR, separándola conceptualmente de las entidades CRM existentes.

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


# Log de Correcciones - DSIGMA Repository

**Fecha:** 6 de Octubre, 2025  
**Revisión realizada por:** Gemini CLI  
**Objetivo:** Estabilizar la aplicación, corregir errores críticos de compilación y runtime, y solucionar la funcionalidad de exportación a PDF.

---

## 📋 Resumen Ejecutivo

Se realizó una revisión y corrección exhaustiva de la aplicación, que presentaba inestabilidad crítica. Se solucionaron múltiples errores que impedían la compilación y causaban fallos en la interfaz de usuario. Adicionalmente, se reparó y optimizó la funcionalidad de exportación a PDF.

### Estado Inicial vs Final
- **Build Status:** ❌ Failed → ✅ Success
- **Errores de Runtime (UI):** Críticos → 0 ✅
- **Funcionalidad PDF:** ❌ Rota → ✅ Funcional y Optimizada
- **Tamaño de archivo PDF:** 10.2 MB → ~6 KB ✅

---

## 🛠️ Correcciones Realizadas

### 1. Estabilización del Entorno de Desarrollo y Compilación
- **Corregido el script de compilación:** Se eliminó el flag inválido `--turbopack` del comando `next build`.
- **Solucionados errores de consulta en Prisma:**
    - Se eliminó el uso de `mode: 'insensitive'` en todas las consultas, ya que no es compatible con la base de datos SQLite del proyecto.
    - Se corrigió el nombre del campo `descripcion` a `storyline` en las consultas de búsqueda de proyectos.
- **Arreglada la configuración de ESLint:** Se ajustó el archivo `eslint.config.mjs` para resolver un error de configuración que impedía la ejecución del linter.

### 2. Corrección de Errores Críticos en la Interfaz de Usuario
- **Problema:** La aplicación fallaba en múltiples páginas debido al uso de un hook de React no compatible (`useActionState`).
- **Solución:** Se reemplazó `useActionState` por `useFormState` (compatible con la versión de React del proyecto) en 15 archivos de componentes, eliminando la causa principal de la inestabilidad.
- **Archivos Modificados:**
    - `src/components/StaffTable.tsx`
    - `src/components/ClienteEditForm.tsx`
    - `src/components/ClienteNewForm.tsx`
    - `src/components/ClientesTable.tsx`
    - `src/components/IntegracionEditForm.tsx`
    - `src/components/IntegracionNewForm.tsx`
    - `src/components/IntegracionesTable.tsx`
    - `src/components/ProfileForm.tsx`
    - `src/components/ProyectoDetail.tsx`
    - `src/components/ProyectoEditForm.tsx`
    - `src/components/ProyectoNewForm.tsx`
    - `src/components/SettingsForm.tsx`
    - `src/components/StaffEditForm.tsx`
    - `src/components/StaffNewForm.tsx`
    - `src/components/TecnologiaForm.tsx`

### 3. Reparación y Optimización de la Exportación a PDF
- **Problema:** La funcionalidad "Exportar a PDF" estaba rota, generando un error `wrong PNG signature`.
- **Diagnóstico:**
    1. Se detectó que las dependencias `jspdf` y `html2canvas` no estaban instaladas.
    2. Después de instalarlas, el error persistía. Se descubrió que la imagen generada por `html2canvas` estaba vacía.
    3. La causa raíz era que el componente a imprimir estaba oculto con `display: none`, haciéndolo inaccesible para el script.
- **Solución:**
    1. Se instalaron las dependencias `jspdf` y `html2canvas`.
    2. Se modificó el estilo del componente imprimible para que estuviera posicionado fuera de la pantalla en lugar de oculto, permitiendo que `html2canvas` lo capture.
- **Optimización:**
    - **Problema:** El PDF generado era muy pesado (10.2 MB).
    - **Solución:** Se ajustó la configuración de `html2canvas` para reducir la escala de la imagen y se cambió el formato de PNG a JPEG, reduciendo el tamaño del archivo a ~6 KB.
- **Archivo Modificado:** `src/components/ProyectoDetail.tsx`

---

## 🎯 Estado Final

### ✅ Logros Alcanzados:
- **Aplicación estable y compilable.**
- **Cero errores críticos** en la interfaz de usuario.
- **Funcionalidad de exportación a PDF restaurada** y optimizada.
- **Código más robusto** y compatible con las versiones de las dependencias del proyecto.

---



# Log de Correcciones - DSIGMA Repository

**Fecha:** 26 de Septiembre, 2024  
**Revisión realizada por:** GitHub Copilot CLI  
**Objetivo:** Identificar y corregir problemas críticos en el repositorio SIGMA CRM

---

## 📋 Resumen Ejecutivo

Se identificaron y corrigieron **31 problemas críticos** en el repositorio, incluyendo 9 errores que impedían la compilación del proyecto y 22 warnings de calidad de código.

### Estado Inicial vs Final
- **ESLint Errores:** 9 → 0 ✅
- **ESLint Warnings:** 22 → 0 ✅
- **Build Status:** ❌ Failed → ✅ Success
- **Configuración Next.js:** ❌ Invalid → ✅ Valid

---

## 🔍 Problemas Identificados Inicialmente

### Críticos (Impedían Compilación)
1. **9 Errores de TypeScript - `@typescript-eslint/no-explicit-any`**
2. **Configuración inválida de Next.js** - `serverActions` deprecated
3. **NextAuth.js mal configurado** - Export inválido en route handler
4. **Consultas de BD incorrectas** - Usando `prisma.staff` en lugar de `prisma.user`
5. **Tipos de datos incompatibles** - Varios campos con tipos incorrectos

### Advertencias (Calidad de Código)
1. **22 Variables/imports no utilizados**
2. **Archivos duplicados** - `package-lock.json` en raíz
3. **Parámetros de función no utilizados**

---

## 🛠️ Correcciones Realizadas

### 1. Corrección de Tipos TypeScript

#### Archivos Modificados:
- `src/app/api/glpi/issues/route.ts`
- `src/app/api/imap/emails/route.ts`  
- `src/components/GitlabActivity.tsx`
- `src/components/GlpiIssues.tsx`
- `src/components/RedmineIssues.tsx`
- `src/components/ZimbraEmails.tsx`
- `src/lib/actions.ts`
- `src/app/api/caldav/events/route.ts`

#### Cambios Realizados:
```typescript
// ANTES: Uso de 'any'
const headers: any = {
  'Content-Type': 'application/json',
  'Authorization': `user_token ${api_key}`,
};

// DESPUÉS: Tipos específicos
const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  'Authorization': `user_token ${api_key}`,
};
```

```typescript
// ANTES: Arrays sin tipo
const fetchEmails = (): Promise<any[]> => {

// DESPUÉS: Arrays tipados
const fetchEmails = (): Promise<Array<Record<string, unknown>>> => {
```

```typescript
// ANTES: Mapeo sin tipos
{projects.map((project: any) => (

// DESPUÉS: Interfaces específicas
{projects.map((project: { id: string; name: string }) => (
```

### 2. Configuración de Next.js

#### Archivo: `next.config.ts`
```typescript
// ANTES: Configuración inválida
const nextConfig: NextConfig = {
  serverActions: {
    bodySizeLimit: '10mb',
  },
}

// DESPUÉS: Configuración experimental válida
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}
```

### 3. Reestructuración de NextAuth

#### Nuevos Archivos Creados:
- `src/lib/auth.ts` - Configuración centralizada de NextAuth

#### Archivos Modificados:
- `src/app/api/auth/[...nextauth]/route.ts` - Simplificado
- Múltiples archivos con importaciones actualizadas

```typescript
// ANTES: Export problemático
export const authOptions = { /* config */ };
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// DESPUÉS: Configuración separada
// En src/lib/auth.ts
export const authOptions = { /* config */ };

// En route.ts
import { authOptions } from '@/lib/auth';
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 4. Corrección de Consultas de Base de Datos

#### Archivos Afectados:
- `src/app/api/gitlab/commits/route.ts`
- `src/app/api/gitlab/projects/route.ts` 
- `src/app/api/gitlab/issues/route.ts`
- `src/app/api/glpi/issues/route.ts`
- `src/app/api/redmine/issues/route.ts`

```typescript
// ANTES: Consulta incorrecta (Staff no tiene API keys)
const user = await prisma.staff.findUnique({ 
  where: { email: session.user.email } 
});

// DESPUÉS: Consulta correcta (User tiene API keys)
const user = await prisma.user.findUnique({ 
  where: { email: session.user.email } 
});
```

### 5. Limpieza de Código

#### Imports Removidos:
```typescript
// Ejemplos de imports no utilizados eliminados
import { redirect } from 'next/navigation'; // Removido de múltiples archivos
import { writeFile, mkdir, unlink } from 'fs/promises'; // No utilizados
import { Cog8ToothIcon } from '@heroicons/react/24/outline'; // No utilizado
import { useCallback } from 'react'; // No utilizado
```

#### Variables No Utilizadas Eliminadas:
```typescript
// Variables removidas en src/app/proyectos/[id]/page.tsx
const controlVersiones = await prisma.controlVersiones.findMany();
const statusPmo = await prisma.statusPmo.findMany();
const statusSalud = await prisma.statusSalud.findMany();
const createOrUpdateTecnologiaWithId = createOrUpdateTecnologia.bind(null, proyecto.id);
```

#### Parámetros de Función Optimizados:
```typescript
// ANTES: Parámetros no utilizados
imap.openBox('INBOX', true, (err, box) => {
f.on('message', (msg, seqno) => {
  msg.on('body', (stream, info) => {

// DESPUÉS: Solo parámetros necesarios
imap.openBox('INBOX', true, (err) => {
f.on('message', (msg) => {
  msg.on('body', (stream) => {
```

### 6. Correcciones en Seed de Base de Datos

#### Archivo: `prisma/seed.ts`
```typescript
// ANTES: Campo inexistente
url_captura: 'https://example.com/captura.png',

// DESPUÉS: Campo removido (no existe en esquema)
// url_captura removido completamente
```

### 7. Interfaz para Eventos de Calendario

#### Archivo: `src/app/api/caldav/events/route.ts`
```typescript
// Interfaz agregada para mejor tipado
interface CalendarEvent {
  type: string;
  summary: string;
  start: Date;
  end: Date;
  rrule?: {
    options: Record<string, unknown>;
  };
}
```

### 8. Limpieza de Archivos

#### Archivos Eliminados:
- `/Users/dcolom/DSIGMA/package-lock.json` - Duplicado innecesario

---

## 📊 Métricas de Mejora

### ESLint Results
```bash
# ANTES
✖ 31 problems (9 errors, 22 warnings)

# DESPUÉS  
✨ No problems found
```

### Build Status
```bash
# ANTES
Failed to compile.
./src/app/api/glpi/issues/route.ts
24:20  Error: Unexpected any. Specify a different type

# DESPUÉS
✓ Compiled successfully in 11.4s
```

### TypeScript Compilation
- **Errores Críticos:** 9 → 0
- **Warnings de Calidad:** 22 → 0
- **Configuración:** Invalid → Valid

---

## 🔧 Comandos Utilizados

### Verificaciones Realizadas:
```bash
# Análisis inicial
npm run lint
npm run build
git status
git diff --stat

# Correcciones aplicadas
npx prisma generate
rm /Users/dcolom/DSIGMA/package-lock.json
npm run lint  # Verificación final
npm run build # Verificación final
```

### Herramientas de Búsqueda:
```bash
# Identificación de problemas
grep -r "authOptions" src/ --include="*.ts" --include="*.tsx"
grep -r "prisma.staff.findUnique" src/
find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from.*api/auth/\[\.\.\.nextauth\]/route.*|from "@/lib/auth";|g' {} \;
```

---

## 📝 Archivos Creados/Modificados

### Nuevos Archivos:
1. `src/lib/auth.ts` - Configuración centralizada de NextAuth
2. `CHANGELOG_FIXES.md` - Este documento de log

### Archivos Modificados:
1. `next.config.ts` - Configuración experimental
2. `src/app/api/auth/[...nextauth]/route.ts` - Simplificación
3. `src/app/api/glpi/issues/route.ts` - Tipos y consultas
4. `src/app/api/imap/emails/route.ts` - Tipos y configuración
5. `src/components/GitlabActivity.tsx` - Tipos de componentes
6. `src/components/GlpiIssues.tsx` - Tipos de props
7. `src/components/RedmineIssues.tsx` - Tipos de props
8. `src/components/ZimbraEmails.tsx` - Tipos de props
9. `src/components/Sidebar.tsx` - Imports optimizados
10. `src/components/Topbar.tsx` - Imports optimizados
11. `src/lib/actions.ts` - Tipos de funciones
12. `src/app/clientes/page.tsx` - Imports optimizados
13. `src/app/proyectos/[id]/editar/page.tsx` - Imports optimizados
14. `src/app/proyectos/[id]/page.tsx` - Variables y imports optimizados
15. `src/app/proyectos/[id]/tecnologia/editar/page.tsx` - Imports optimizados
16. `src/app/api/gitlab/commits/route.ts` - Consultas de BD
17. `src/app/api/gitlab/projects/route.ts` - Consultas de BD
18. `src/app/api/gitlab/issues/route.ts` - Consultas de BD
19. `src/app/api/redmine/issues/route.ts` - Consultas de BD
20. `src/app/api/caldav/events/route.ts` - Tipos e interfaces
21. `src/middleware.ts` - Parámetros optimizados
22. `prisma/seed.ts` - Campos corregidos

---

## 🎯 Estado Final

### ✅ Logros Alcanzados:
- **Compilación exitosa** del proyecto
- **Cero errores de ESLint**
- **Cero warnings de calidad**
- **Configuración válida** de Next.js 15.5.3
- **Tipos TypeScript** mejorados significativamente
- **Consultas de base de datos** corregidas
- **Código más limpio** y mantenible

### ⚠️ Pendientes (No Críticos):
- Algunos campos del esquema de BD que no existen (`url_captura`, `glpi_app_token`)
- Tipos de NextAuth que podrían mejorarse
- Validaciones adicionales para campos `null`

### 🚀 Recomendaciones Futuras:
1. **Agregar campos faltantes** al esquema de Prisma si son necesarios
2. **Implementar tipos más estrictos** para NextAuth
3. **Agregar validaciones** para campos que pueden ser `null`
4. **Establecer reglas de ESLint más estrictas** para prevenir regresiones
5. **Implementar pre-commit hooks** para mantener calidad de código

---

## 📞 Soporte

Este log documenta todas las correcciones realizadas. Para cualquier consulta sobre los cambios implementados, referirse a los archivos específicos mencionados en cada sección.

**Versión del documento:** 3.2  
**Última actualización:** 26 de Septiembre, 2024