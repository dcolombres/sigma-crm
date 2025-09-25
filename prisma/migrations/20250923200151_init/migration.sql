-- CreateTable
CREATE TABLE "Dependencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Subcategoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "id_categoria" INTEGER,
    CONSTRAINT "Subcategoria_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ControlVersiones" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "StatusPmo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "StatusSalud" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Lenguaje" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BaseDeDatos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre_completo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "rol" TEXT,
    "redmine_api_key" TEXT,
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
CREATE TABLE "AlojamientoInfra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AlojamientoInfraDB" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Proyecto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "storyline" TEXT,
    "activo" BOOLEAN DEFAULT true,
    "id_dependencia_origen" INTEGER,
    "id_dependencia_actual" INTEGER,
    "id_categoria" INTEGER,
    "id_subcategoria" INTEGER,
    "url_captura" TEXT,
    "url_caratula" TEXT,
    "url_ticketera_interna" TEXT,
    "url_ticketera_externa" TEXT,
    "tier" INTEGER,
    CONSTRAINT "Proyecto_id_dependencia_origen_fkey" FOREIGN KEY ("id_dependencia_origen") REFERENCES "Dependencia" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Proyecto_id_dependencia_actual_fkey" FOREIGN KEY ("id_dependencia_actual") REFERENCES "Dependencia" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Proyecto_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Proyecto_id_subcategoria_fkey" FOREIGN KEY ("id_subcategoria") REFERENCES "Subcategoria" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_proyecto" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT,
    "celular" TEXT,
    "observacion" TEXT,
    "fecha_inicio_desarrollo" DATETIME,
    "activo" BOOLEAN DEFAULT true,
    CONSTRAINT "Cliente_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "Proyecto" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tecnologia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_proyecto" INTEGER NOT NULL,
    "id_control_versiones" INTEGER,
    "changelog" BOOLEAN DEFAULT false,
    "url_changelog" TEXT,
    "id_alojamiento_infra" INTEGER,
    "id_alojamiento_infra_db" INTEGER,
    "mantenimiento_soporte" BOOLEAN DEFAULT false,
    "id_status_pmo" INTEGER,
    "id_status_salud" INTEGER,
    "anio_inicio_sistema" INTEGER,
    "usuarios_internos" INTEGER DEFAULT 0,
    "usuarios_externos" INTEGER DEFAULT 0,
    CONSTRAINT "Tecnologia_id_alojamiento_infra_fkey" FOREIGN KEY ("id_alojamiento_infra") REFERENCES "AlojamientoInfra" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Tecnologia_id_alojamiento_infra_db_fkey" FOREIGN KEY ("id_alojamiento_infra_db") REFERENCES "AlojamientoInfraDB" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Tecnologia_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "Proyecto" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Tecnologia_id_control_versiones_fkey" FOREIGN KEY ("id_control_versiones") REFERENCES "ControlVersiones" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Tecnologia_id_status_pmo_fkey" FOREIGN KEY ("id_status_pmo") REFERENCES "StatusPmo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Tecnologia_id_status_salud_fkey" FOREIGN KEY ("id_status_salud") REFERENCES "StatusSalud" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Integracion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "funcion_principal" TEXT,
    "documentacion" TEXT,
    "id_responsable" INTEGER,
    CONSTRAINT "Integracion_id_responsable_fkey" FOREIGN KEY ("id_responsable") REFERENCES "Staff" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProyectoStaff" (
    "id_proyecto" INTEGER NOT NULL,
    "id_staff" INTEGER NOT NULL,

    PRIMARY KEY ("id_proyecto", "id_staff"),
    CONSTRAINT "ProyectoStaff_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "Proyecto" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProyectoStaff_id_staff_fkey" FOREIGN KEY ("id_staff") REFERENCES "Staff" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProyectoIntegracion" (
    "id_proyecto" INTEGER NOT NULL,
    "id_integracion" INTEGER NOT NULL,

    PRIMARY KEY ("id_proyecto", "id_integracion"),
    CONSTRAINT "ProyectoIntegracion_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "Proyecto" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProyectoIntegracion_id_integracion_fkey" FOREIGN KEY ("id_integracion") REFERENCES "Integracion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProyectoLenguaje" (
    "id_proyecto" INTEGER NOT NULL,
    "id_lenguaje" INTEGER NOT NULL,

    PRIMARY KEY ("id_proyecto", "id_lenguaje"),
    CONSTRAINT "ProyectoLenguaje_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "Proyecto" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProyectoLenguaje_id_lenguaje_fkey" FOREIGN KEY ("id_lenguaje") REFERENCES "Lenguaje" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProyectoBaseDeDatos" (
    "id_proyecto" INTEGER NOT NULL,
    "id_base_de_datos" INTEGER NOT NULL,

    PRIMARY KEY ("id_proyecto", "id_base_de_datos"),
    CONSTRAINT "ProyectoBaseDeDatos_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "Proyecto" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProyectoBaseDeDatos_id_base_de_datos_fkey" FOREIGN KEY ("id_base_de_datos") REFERENCES "BaseDeDatos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TelegramMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message_id" INTEGER NOT NULL,
    "chat_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Dependencia_nombre_key" ON "Dependencia"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Subcategoria_nombre_key" ON "Subcategoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ControlVersiones_nombre_key" ON "ControlVersiones"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "StatusPmo_nombre_key" ON "StatusPmo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "StatusSalud_nombre_key" ON "StatusSalud"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Lenguaje_nombre_key" ON "Lenguaje"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "BaseDeDatos_nombre_key" ON "BaseDeDatos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AlojamientoInfra_nombre_key" ON "AlojamientoInfra"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "AlojamientoInfraDB_nombre_key" ON "AlojamientoInfraDB"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Tecnologia_id_proyecto_key" ON "Tecnologia"("id_proyecto");
