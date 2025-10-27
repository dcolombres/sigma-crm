-- CreateEnum
CREATE TYPE "Prioridad" AS ENUM ('Alta', 'Media', 'Baja');

-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('No_Iniciado', 'En_Progreso', 'Operativo', 'En_Pausa', 'A_relevar', 'Otro');

-- CreateEnum
CREATE TYPE "Salud" AS ENUM ('En_Riesgo', 'Con_Problemas', 'Saludable');

-- CreateTable
CREATE TABLE "proyectos" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "origen" TEXT,
    "subsecretaria" TEXT,
    "tier" INTEGER,
    "recursos" INTEGER,
    "equipo" TEXT,
    "salud" "Salud",
    "estado" "Estado",
    "prioridad" "Prioridad",
    "area" TEXT,
    "responsable" TEXT,
    "observacion" TEXT,

    CONSTRAINT "proyectos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "contrato" TEXT,
    "rol" TEXT,
    "nombres" TEXT,
    "apellidos" TEXT,
    "activo" BOOLEAN,
    "comentario" TEXT,
    "proyectos_q" INTEGER,
    "modalidad" TEXT,
    "experiencia" TEXT,
    "origen_staff" TEXT,
    "skills" TEXT,
    "desempeno_ley_dto" TEXT,
    "hhee" BOOLEAN,
    "ur" BOOLEAN,
    "coordinacion" TEXT,
    "presencialidad" TEXT,
    "cumpleanos" TIMESTAMP(3),
    "edad" INTEGER,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proyecto_staff" (
    "proyectoId" INTEGER NOT NULL,
    "staffId" INTEGER NOT NULL,

    CONSTRAINT "proyecto_staff_pkey" PRIMARY KEY ("proyectoId","staffId")
);

-- CreateIndex
CREATE UNIQUE INDEX "proyectos_titulo_key" ON "proyectos"("titulo");

-- CreateIndex
CREATE UNIQUE INDEX "staff_email_key" ON "staff"("email");

-- AddForeignKey
ALTER TABLE "proyecto_staff" ADD CONSTRAINT "proyecto_staff_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "proyectos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proyecto_staff" ADD CONSTRAINT "proyecto_staff_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
