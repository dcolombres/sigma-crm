/*
  Warnings:

  - You are about to drop the column `caldav_password` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `caldav_url` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `caldav_username` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `dashboard_card_visibility` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `gitlab_api_key` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `gitlab_url` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `glpi_api_key` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `glpi_url` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `imap_host` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `imap_port` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `imap_ssl` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `redmine_api_key` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `redmine_url` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `telegram_bot_token` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `telegram_chat_id` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `zimbra_password` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `zimbra_username` on the `Staff` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Proyecto" ADD COLUMN "cantidad_recursos_asignados" INTEGER;
ALTER TABLE "Proyecto" ADD COLUMN "urls" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "rol" TEXT,
    "redmine_api_key" TEXT,
    "redmine_url" TEXT,
    "gitlab_api_key" TEXT,
    "gitlab_url" TEXT,
    "telegram_bot_token" TEXT,
    "telegram_chat_id" TEXT,
    "glpi_api_key" TEXT,
    "glpi_url" TEXT,
    "zimbra_username" TEXT,
    "zimbra_password" TEXT,
    "caldav_url" TEXT,
    "caldav_username" TEXT,
    "caldav_password" TEXT,
    "imap_host" TEXT,
    "imap_port" INTEGER,
    "imap_ssl" BOOLEAN,
    "dashboard_card_visibility" JSONB
);

-- CreateTable
CREATE TABLE "ClienteIntegracion" (
    "id_cliente" INTEGER NOT NULL,
    "id_integracion" INTEGER NOT NULL,

    PRIMARY KEY ("id_cliente", "id_integracion"),
    CONSTRAINT "ClienteIntegracion_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClienteIntegracion_id_integracion_fkey" FOREIGN KEY ("id_integracion") REFERENCES "Integracion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Staff" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "origen" TEXT,
    "email" TEXT NOT NULL,
    "skills" TEXT,
    "desempeno_ley_dto" TEXT,
    "hhee" BOOLEAN,
    "ur" BOOLEAN,
    "coordinacion" TEXT,
    "presencialidad" TEXT,
    "cumpleanos" DATETIME,
    "edad" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "Staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Staff" ("email", "id", "nombre_completo", "rol") SELECT "email", "id", "nombre_completo", "rol" FROM "Staff";
DROP TABLE "Staff";
ALTER TABLE "new_Staff" RENAME TO "Staff";
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");
CREATE UNIQUE INDEX "Staff_userId_key" ON "Staff"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
