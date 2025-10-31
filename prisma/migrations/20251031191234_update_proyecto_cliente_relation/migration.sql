/*
  Warnings:

  - You are about to drop the column `apellido` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `dependencia` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `id_proyecto` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `remuneracion` on the `Staff` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Cliente" DROP CONSTRAINT "Cliente_id_proyecto_fkey";

-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "apellido",
DROP COLUMN "dependencia",
DROP COLUMN "id_proyecto";

-- AlterTable
ALTER TABLE "Proyecto" ADD COLUMN     "backend_framework" TEXT,
ADD COLUMN     "backend_lenguaje_principal" TEXT,
ADD COLUMN     "backend_librerias" TEXT,
ADD COLUMN     "backend_otro_lenguaje" TEXT,
ADD COLUMN     "backend_version" TEXT,
ADD COLUMN     "captura_url" TEXT,
ADD COLUMN     "categoria" TEXT,
ADD COLUMN     "cliente_nombre" TEXT,
ADD COLUMN     "db_backup" TEXT,
ADD COLUMN     "db_tamanio" TEXT,
ADD COLUMN     "db_tecnologia" TEXT,
ADD COLUMN     "db_tecnologia_2" TEXT,
ADD COLUMN     "db_version" TEXT,
ADD COLUMN     "dependencia" TEXT,
ADD COLUMN     "equipo" TEXT,
ADD COLUMN     "frontend_framework" TEXT,
ADD COLUMN     "frontend_lenguaje_principal" TEXT,
ADD COLUMN     "frontend_librerias" TEXT,
ADD COLUMN     "frontend_otro_lenguaje" TEXT,
ADD COLUMN     "frontend_version" TEXT,
ADD COLUMN     "idCliente" INTEGER,
ADD COLUMN     "infra_alojamiento_hml" TEXT,
ADD COLUMN     "infra_alojamiento_tst" TEXT,
ADD COLUMN     "infra_contenedor" TEXT,
ADD COLUMN     "infra_instrucciones_deploy" TEXT,
ADD COLUMN     "infra_instrucciones_stack" TEXT,
ADD COLUMN     "infra_notas_adicionales" TEXT,
ADD COLUMN     "infra_referente" TEXT,
ADD COLUMN     "infra_vms" TEXT,
ADD COLUMN     "nube" TEXT,
ADD COLUMN     "observacion" TEXT,
ADD COLUMN     "origen" TEXT,
ADD COLUMN     "responsable_nombre" TEXT,
ADD COLUMN     "stack" TEXT,
ADD COLUMN     "subcategoria" TEXT,
ADD COLUMN     "ticketera_externa" TEXT,
ADD COLUMN     "ticketera_interna" TEXT,
ADD COLUMN     "tier" TEXT;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "remuneracion";

-- AddForeignKey
ALTER TABLE "Proyecto" ADD CONSTRAINT "Proyecto_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
