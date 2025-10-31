/*
  Warnings:

  - You are about to drop the column `dependencia` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `notas_adicionales` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `remuneracion` on the `Staff` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "dependencia",
DROP COLUMN "notas_adicionales";

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "remuneracion";
