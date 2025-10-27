-- AlterTable
ALTER TABLE "integraciones" ADD COLUMN     "documentacion" TEXT,
ADD COLUMN     "funcion_principal" TEXT,
ADD COLUMN     "id_responsable" INTEGER;

-- AddForeignKey
ALTER TABLE "integraciones" ADD CONSTRAINT "integraciones_id_responsable_fkey" FOREIGN KEY ("id_responsable") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
