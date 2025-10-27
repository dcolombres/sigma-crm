/*
  Warnings:

  - You are about to drop the `clientes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dpr_proyectos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dpr_staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `integraciones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `proyecto_staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `proyectos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."integraciones" DROP CONSTRAINT "integraciones_id_responsable_fkey";

-- DropForeignKey
ALTER TABLE "public"."proyecto_staff" DROP CONSTRAINT "proyecto_staff_proyectoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."proyecto_staff" DROP CONSTRAINT "proyecto_staff_staffId_fkey";

-- DropForeignKey
ALTER TABLE "public"."proyectos" DROP CONSTRAINT "proyectos_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."proyectos" DROP CONSTRAINT "proyectos_integracionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."staff" DROP CONSTRAINT "staff_userId_fkey";

-- DropTable
DROP TABLE "public"."clientes";

-- DropTable
DROP TABLE "public"."dpr_proyectos";

-- DropTable
DROP TABLE "public"."dpr_staff";

-- DropTable
DROP TABLE "public"."integraciones";

-- DropTable
DROP TABLE "public"."proyecto_staff";

-- DropTable
DROP TABLE "public"."proyectos";

-- DropTable
DROP TABLE "public"."staff";

-- DropTable
DROP TABLE "public"."users";

-- DropEnum
DROP TYPE "public"."Estado";

-- DropEnum
DROP TYPE "public"."Prioridad";

-- DropEnum
DROP TYPE "public"."Salud";

-- CreateTable
CREATE TABLE "Staff" (
    "id" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rol_staff" TEXT,
    "contrato" TEXT,
    "modalidad" TEXT,
    "experiencia" TEXT,
    "origen" TEXT,
    "skills" TEXT,
    "desempeno_ley_dto" TEXT,
    "coordinacion" TEXT,
    "presencialidad" TEXT,
    "cumpleanos" TEXT,
    "comentario" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "hhee" BOOLEAN NOT NULL DEFAULT false,
    "ur" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proyecto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo_trazabilidad" TEXT,
    "descripcion" TEXT,
    "id_responsable" INTEGER,
    "id_subresponsable" INTEGER,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "id_status_redmine" INTEGER,
    "status_redmine" TEXT,
    "id_plataforma" INTEGER,
    "plataforma" TEXT,
    "id_area_funcional" INTEGER,
    "area_funcional" TEXT,
    "id_tipo_desarrollo" INTEGER,
    "tipo_desarrollo" TEXT,
    "id_etapa_actual" INTEGER,
    "etapa_actual" TEXT,
    "id_control_versiones" INTEGER,
    "control_versiones" TEXT,
    "url_control_versiones" TEXT,
    "id_tipo_sistema" INTEGER,
    "tipo_sistema" TEXT,
    "id_alojamiento_infra" INTEGER,
    "alojamiento_infra" TEXT,
    "id_alojamiento_infra_db" INTEGER,
    "alojamiento_infra_db" TEXT,
    "mantenimiento_soporte" BOOLEAN,
    "id_status_pmo" INTEGER,
    "status_pmo" TEXT,
    "id_status_salud" INTEGER,
    "status_salud" TEXT,
    "anio_inicio_sistema" INTEGER,
    "usuarios_internos" INTEGER,
    "usuarios_externos" INTEGER,
    "url_sistema" TEXT,
    "url_sistema_desarrollo" TEXT,
    "url_repositorio" TEXT,
    "url_manual_tecnico" TEXT,
    "url_manual_usuario" TEXT,
    "url_documentacion" TEXT,
    "url_incidencias" TEXT,
    "url_changelog" TEXT,
    "changelog" BOOLEAN,

    CONSTRAINT "Proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "id_proyecto" INTEGER NOT NULL,
    "email" TEXT,
    "celular" TEXT,
    "observacion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_inicio_desarrollo" TIMESTAMP(3),

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DPR_Area" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "DPR_Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DPR_Plataforma" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "DPR_Plataforma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DPR_TipoDesarrollo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "DPR_TipoDesarrollo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DPR_EtapaActual" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "DPR_EtapaActual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DPR_ControlVersiones" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "DPR_ControlVersiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DPR_TipoSistema" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "DPR_TipoSistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DPR_AlojamientoInfra" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "DPR_AlojamientoInfra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DPR_StatusPmo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "DPR_StatusPmo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DPR_StatusSalud" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "DPR_StatusSalud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "staffId" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProyectoToStaff" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProyectoToStaff_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_staffId_key" ON "User"("staffId");

-- CreateIndex
CREATE INDEX "_ProyectoToStaff_B_index" ON "_ProyectoToStaff"("B");

-- AddForeignKey
ALTER TABLE "Proyecto" ADD CONSTRAINT "Proyecto_id_responsable_fkey" FOREIGN KEY ("id_responsable") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proyecto" ADD CONSTRAINT "Proyecto_id_subresponsable_fkey" FOREIGN KEY ("id_subresponsable") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProyectoToStaff" ADD CONSTRAINT "_ProyectoToStaff_A_fkey" FOREIGN KEY ("A") REFERENCES "Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProyectoToStaff" ADD CONSTRAINT "_ProyectoToStaff_B_fkey" FOREIGN KEY ("B") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
