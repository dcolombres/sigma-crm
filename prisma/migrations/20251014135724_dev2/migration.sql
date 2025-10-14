/*
  Warnings:

  - You are about to drop the column `url_caratula` on the `Proyecto` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Proyecto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "storyline" TEXT,
    "activo" BOOLEAN DEFAULT true,
    "id_dependencia_origen" INTEGER,
    "id_dependencia_actual" INTEGER,
    "id_categoria" INTEGER,
    "id_subcategoria" INTEGER,
    "captura_data" BLOB,
    "captura_type" TEXT,
    "url_ticketera_interna" TEXT,
    "url_ticketera_externa" TEXT,
    "tier" INTEGER,
    "urls" TEXT,
    "cantidad_recursos_asignados" INTEGER,
    CONSTRAINT "Proyecto_id_dependencia_origen_fkey" FOREIGN KEY ("id_dependencia_origen") REFERENCES "Dependencia" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Proyecto_id_dependencia_actual_fkey" FOREIGN KEY ("id_dependencia_actual") REFERENCES "Dependencia" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Proyecto_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Proyecto_id_subcategoria_fkey" FOREIGN KEY ("id_subcategoria") REFERENCES "Subcategoria" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Proyecto" ("activo", "cantidad_recursos_asignados", "captura_data", "captura_type", "id", "id_categoria", "id_dependencia_actual", "id_dependencia_origen", "id_subcategoria", "storyline", "tier", "titulo", "url_ticketera_externa", "url_ticketera_interna", "urls") SELECT "activo", "cantidad_recursos_asignados", "captura_data", "captura_type", "id", "id_categoria", "id_dependencia_actual", "id_dependencia_origen", "id_subcategoria", "storyline", "tier", "titulo", "url_ticketera_externa", "url_ticketera_interna", "urls" FROM "Proyecto";
DROP TABLE "Proyecto";
ALTER TABLE "new_Proyecto" RENAME TO "Proyecto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
