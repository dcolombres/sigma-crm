-- AlterTable
ALTER TABLE "proyectos" ADD COLUMN     "integracionId" INTEGER;

-- CreateTable
CREATE TABLE "integraciones" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" VARCHAR(400),

    CONSTRAINT "integraciones_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_integracionId_fkey" FOREIGN KEY ("integracionId") REFERENCES "integraciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;
