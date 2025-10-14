import { z } from 'zod';

import { z } from 'zod';

export const ApiKeySchema = z.object({
  staffId: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive("ID de personal inválido.")
  ),
  redmine_api_key: z.string().optional(),
  redmine_url: z.string().url("URL de Redmine inválida.").optional().or(z.literal("")),
  gitlab_api_key: z.string().optional(),
  gitlab_url: z.string().url("URL de GitLab inválida.").optional().or(z.literal("")),
  telegram_bot_token: z.string().optional(),
  telegram_chat_id: z.string().optional(),
  glpi_url: z.string().url("URL de GLPI inválida.").optional().or(z.literal("")),
  glpi_api_key: z.string().optional(),
  caldav_url: z.string().url("URL de CalDAV inválida.").optional().or(z.literal("")),
  caldav_username: z.string().optional(),
  caldav_password: z.string().optional(),
  imap_host: z.string().optional(),
  imap_port: z.preprocess(
    (a) => (a === '' ? null : parseInt(z.string().parse(a), 10)),
    z.number().nullable().optional()
  ),
  imap_ssl: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  zimbra_username: z.string().optional(),
  zimbra_password: z.string().optional(),
  redmine_enabled: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  gitlab_enabled: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  telegram_enabled: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  glpi_enabled: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  caldav_enabled: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  imap_enabled: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
});

export const ClientSchema = z.object({
  nombre: z.string().min(1, "El nombre es un campo obligatorio."),
  id_proyecto: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive("El proyecto es un campo obligatorio.")
  ),
  email: z.string().email("Formato de email inválido.").optional().or(z.literal("")),
  celular: z.string().optional(),
  observacion: z.string().optional(),
  activo: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  fecha_inicio_desarrollo: z.string().optional().or(z.literal("")),
});

export const IntegrationSchema = z.object({
  nombre: z.string().min(1, "El nombre de la integración es requerido."),
  funcion_principal: z.string().optional(),
  documentacion: z.string().optional(),
  id_responsable: z.preprocess(
    (a) => (a === '' ? null : parseInt(z.string().parse(a), 10)),
    z.number().nullable().optional()
  ),
});

export const StaffSchema = z.object({
  nombres: z.string().min(1, "Los nombres son requeridos."),
  apellidos: z.string().min(1, "Los apellidos son requeridos."),
  email: z.string().email("Formato de email inválido."),
  rol_staff: z.string().optional(),
  contrato: z.string().optional(),
  modalidad: z.string().optional(),
  experiencia: z.string().optional(),
  origen: z.string().optional(),
  skills: z.string().optional(),
  desempeno_ley_dto: z.string().optional(),
  coordinacion: z.string().optional(),
  presencialidad: z.string().optional(),
  cumpleanos: z.string().optional().or(z.literal("")),
  comentario: z.string().optional(),
  activo: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  hhee: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  ur: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  proyectos: z.array(z.string()).optional(), // Array of project IDs as strings
});

export const TecnologiaSchema = z.object({
  id_proyecto: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive("ID de proyecto inválido.")
  ),
  id_control_versiones: z.preprocess(
    (a) => (a === '' ? null : parseInt(z.string().parse(a), 10)),
    z.number().nullable().optional()
  ),
  changelog: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  url_changelog: z.string().url("URL de Changelog inválida.").optional().or(z.literal("")),
  id_alojamiento_infra: z.preprocess(
    (a) => (a === '' ? null : parseInt(z.string().parse(a), 10)),
    z.number().nullable().optional()
  ),
  id_alojamiento_infra_db: z.preprocess(
    (a) => (a === '' ? null : parseInt(z.string().parse(a), 10)),
    z.number().nullable().optional()
  ),
  mantenimiento_soporte: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  id_status_pmo: z.preprocess(
    (a) => (a === '' ? null : parseInt(z.string().parse(a), 10)),
    z.number().nullable().optional()
  ),
  id_status_salud: z.preprocess(
    (a) => (a === '' ? null : parseInt(z.string().parse(a), 10)),
    z.number().nullable().optional()
  ),
  anio_inicio_sistema: z.preprocess(
    (a) => (a === '' ? null : parseInt(z.string().parse(a), 10)),
    z.number().nullable().optional()
  ),
  usuarios_internos: z.preprocess(
    (a) => (a === '' ? null : parseInt(z.string().parse(a), 10)),
    z.number().nullable().optional()
  ),
  usuarios_externos: z.preprocess(
    (a) => (a === '' ? null : parseInt(z.string().parse(a), 10)),
    z.number().nullable().optional()
  ),
});

export const ApiKeySchema = z.object({
  staffId: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive("ID de personal inválido.")
  ),
  redmine_api_key: z.string().optional(),
  redmine_url: z.string().url("URL de Redmine inválida.").optional().or(z.literal("")),
  gitlab_api_key: z.string().optional(),
  gitlab_url: z.string().url("URL de GitLab inválida.").optional().or(z.literal("")),
  telegram_bot_token: z.string().optional(),
  telegram_chat_id: z.string().optional(),
  glpi_url: z.string().url("URL de GLPI inválida.").optional().or(z.literal("")),
  glpi_api_key: z.string().optional(),
  caldav_url: z.string().url("URL de CalDAV inválida.").optional().or(z.literal("")),
  caldav_username: z.string().optional(),
  caldav_password: z.string().optional(),
  imap_host: z.string().optional(),
  imap_port: z.preprocess(
    (a) => (a === '' ? null : parseInt(z.string().parse(a), 10)),
    z.number().nullable().optional()
  ),
  imap_ssl: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  zimbra_username: z.string().optional(),
  zimbra_password: z.string().optional(),
  redmine_enabled: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  gitlab_enabled: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  telegram_enabled: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  glpi_enabled: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  caldav_enabled: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
  imap_enabled: z.preprocess(
    (a) => a === 'on',
    z.boolean().optional()
  ),
});

export const AssignStaffSchema = z.object({
  id_proyecto: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive("ID de proyecto inválido.")
  ),
  id_staff: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive("ID de staff inválido.")
  ),
});

export const SearchQuerySchema = z.object({
  query: z.string().min(1, "La consulta de búsqueda no puede estar vacía."),
});
