-- CreateTable
CREATE TABLE "dpr_proyectos" (
    "id" SERIAL NOT NULL,
    "sistema" TEXT,
    "tier" TEXT,
    "estado" TEXT,
    "salud" TEXT,
    "prioridad" TEXT,
    "area" TEXT,
    "source" TEXT,

    CONSTRAINT "dpr_proyectos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dpr_staff" (
    "id" SERIAL NOT NULL,
    "Nombre y Apellido" TEXT,
    "ROL" TEXT,
    "Tecnologia" TEXT,
    "REM NETA ABRIL" DOUBLE PRECISION,
    "source" TEXT,

    CONSTRAINT "dpr_staff_pkey" PRIMARY KEY ("id")
);
