/*
  Warnings:

  - You are about to drop the column `userId` on the `Staff` table. All the data in the column will be lost.

*/
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
    "edad" INTEGER
);
INSERT INTO "new_Staff" ("activo", "apellidos", "comentario", "contrato", "coordinacion", "cumpleanos", "desempeno_ley_dto", "edad", "email", "experiencia", "hhee", "id", "modalidad", "nombre_completo", "nombres", "origen", "presencialidad", "proyectos_q", "rol", "skills", "ur") SELECT "activo", "apellidos", "comentario", "contrato", "coordinacion", "cumpleanos", "desempeno_ley_dto", "edad", "email", "experiencia", "hhee", "id", "modalidad", "nombre_completo", "nombres", "origen", "presencialidad", "proyectos_q", "rol", "skills", "ur" FROM "Staff";
DROP TABLE "Staff";
ALTER TABLE "new_Staff" RENAME TO "Staff";
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "rol" TEXT,
    "staffId" INTEGER,
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
    "dashboard_card_visibility" JSONB,
    CONSTRAINT "User_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("caldav_password", "caldav_url", "caldav_username", "dashboard_card_visibility", "email", "gitlab_api_key", "gitlab_url", "glpi_api_key", "glpi_url", "id", "imap_host", "imap_port", "imap_ssl", "password", "redmine_api_key", "redmine_url", "rol", "telegram_bot_token", "telegram_chat_id", "zimbra_password", "zimbra_username") SELECT "caldav_password", "caldav_url", "caldav_username", "dashboard_card_visibility", "email", "gitlab_api_key", "gitlab_url", "glpi_api_key", "glpi_url", "id", "imap_host", "imap_port", "imap_ssl", "password", "redmine_api_key", "redmine_url", "rol", "telegram_bot_token", "telegram_chat_id", "zimbra_password", "zimbra_username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_staffId_key" ON "User"("staffId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
