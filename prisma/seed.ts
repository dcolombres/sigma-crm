import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Seed Staff and Users
  console.log('Seeding staff and users...');

  const staffData = [
    {
      nombre_completo: 'Default User',
      email: 'user@example.com',
      rol_staff: 'admin',
    },
    {
      nombre_completo: 'dcolom',
      email: 'dcolom@produccion.gob.ar',
      rol_staff: 'administrador',
    }
  ];

  for (const data of staffData) {
    await prisma.staff.upsert({
      where: { email: data.email },
      update: data,
      create: data,
    });
  }
  console.log('Staff seeded.');

  const userData = [
      {
        email: 'user@example.com',
        password: 'password',
        rol: 'admin',
        redmine_api_key: 'd22a283e6444c1d5b1e09a4b9061c08fc6c21d06',
        gitlab_api_key: 'your_gitlab_api_key',
        gitlab_url: 'https://gitlab.com',
        telegram_bot_token: 'your_telegram_bot_token',
        telegram_chat_id: 'your_telegram_chat_id',
        glpi_api_key: 'your_glpi_api_key',
        glpi_url: 'https://your_glpi_url',
        zimbra_username: 'your_zimbra_username',
        zimbra_password: 'your_zimbra_password',
        caldav_url: 'https://your_caldav_url',
        caldav_username: 'your_caldav_username',
        caldav_password: 'your_caldav_password',
        imap_host: 'your_imap_host',
        imap_port: 993,
        imap_ssl: true,
        dashboard_card_visibility: {
          redmine: true,
          gitlab: true,
          telegram: true,
          glpi: true,
          caldav: true,
          imap: true,
        },
      },
      {
        email: 'dcolom@produccion.gob.ar',
        password: 'password',
        rol: 'administrador',
      }
  ];

  for (const data of userData) {
      const staff = await prisma.staff.findUnique({ where: { email: data.email }});
      if (staff) {
          await prisma.user.upsert({
              where: { email: data.email },
              update: {
                  ...data,
                  staffId: staff.id,
              },
              create: {
                  ...data,
                  staffId: staff.id,
              }
          });
      }
  }
  console.log('Users seeded and linked to staff.');

  // Seed Dependencias
  const dependencias = [
    'Industria', 'Pyme', 'Produccion', 'Energia', 'Mineria', 'Magyp', 'Inti', 'INPI', 'Ec del Conocimiento', 'Comercio', 'Pesca', 'Def. del Consumidor', 'otro'
  ];
  for (const nombre of dependencias) {
    await prisma.dependencia.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  // Seed Categorias
  const categorias = [
    'Aplicativo', 'Servicio', 'Sistema', 'Plataforma', 'Formulario', 'Registro', 'Tableros', 'APP Mobile', 'Microservicio', 'API', 'Otra'
  ];
  for (const nombre of categorias) {
    await prisma.categoria.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  // Seed Subcategorias
  const subcategorias = [
    'Web', 'Mobile', 'CMS', 'Monitor', 'Procesos', 'Envío Masivo', 'Datos', 'Plataforma', 'Asesoramiento', 'Otra'
  ];
  for (const nombre of subcategorias) {
    await prisma.subcategoria.upsert({
      where: { nombre },
      update: {},
      create: { nombre, id_categoria: 1 }, // Assuming 'Aplicativo' category
    });
  }

  // Seed ControlVersiones
  const controlVersiones = [
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SourceTree', 'GitKraken', 'Visual Studio Code', 'otro'
  ];
  for (const nombre of controlVersiones) {
    await prisma.controlVersiones.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  // Seed StatusPmo
  const statusPmo = [
    'Operativo', 'mantenimiento', 'en desarrollo', 'frenado', 'en analisis', 'discontinuado'
  ];
  for (const nombre of statusPmo) {
    await prisma.statusPmo.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  // Seed StatusSalud
  const statusSalud = ['Mala', 'media', 'buena'];
  for (const nombre of statusSalud) {
    await prisma.statusSalud.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  // Seed Lenguajes
  const lenguajes = [
    'PHP', '.NET', 'Java', 'Python', 'JavaScript', 'Ruby', 'C++', 'C#', 'Swift', 'Go', 'TypeScript', 'Kotlin', 'HTML', 'CSS', 'Dart', 'JSX', 'SASS', 'LESS', 'JSON', 'Otro'
  ];
  for (const nombre of lenguajes) {
    await prisma.lenguaje.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  // Seed BaseDeDatos
  const basesDeDatos = [
    'MySQL', 'PostgreSQL', 'SQLite', 'MongoDB', 'Microsoft SQL Server', 'Oracle Database', 'MariaDB', 'Redis', 'Cassandra', 'Firebase', 'otros'
  ];
  for (const nombre of basesDeDatos) {
    await prisma.baseDeDatos.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  // New: Seed AlojamientoInfra
  const alojamientoInfra = [
    'ARSAT Produccion', 'ARSAT', 'MAGYP', 'AWS 01', 'AWS 02', 'AWS 03', 'DATACENTER JAR', 'DATACENTER PC', 'DATACENTER MECON'
  ];
  for (const nombre of alojamientoInfra) {
    await prisma.alojamientoInfra.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  // New: Seed AlojamientoInfraDB
  const alojamientoInfraDB = [
    'ARSAT Produccion', 'ARSAT', 'MAGYP', 'AWS 01', 'AWS 02', 'AWS 03', 'DATACENTER JAR', 'DATACENTER PC', 'DATACENTER MECON'
  ]; // Assuming same options as AlojamientoInfra for now
  for (const nombre of alojamientoInfraDB) {
    await prisma.alojamientoInfraDB.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  // Seed Project Titles
  console.log('Seeding project titles...');
  const projectTitles = [
    'Aportes Forestales', 'Autogestión', 'Automatizaciones', 'Autopartes SGA', 'Autos Oficiales',
    'Banco de Imagenes', 'Bandas', 'Bandas Horarias', 'Biblioteca Tettamanti', 'Biotecnología Moderna',
    'BK 4.0', 'BK SUR', 'BK3', 'Bono Fomento', 'Cambio rural- mobile', 'Campus Virtual',
    'Certificados WEB', 'Chatbot', 'CITC', 'CNDC - Buscador dictamenes y fallos', 'Codesarrollo',
    'Cofra', 'Comedor', 'Compensaciones Pequeños y medianos productores de soja y maíz',
    'Control de Accesos', 'COPREC', 'CRM', 'CTIT', 'CTIT - CTZF', 'Cuota Simple', 'ARCON',
    'DATOS - Tableros POWER BI', 'Datos Estimaciones', 'Debida Diligencia', 'Digitalización De Expedientes',
    'DJVEL', 'DNA2 - Credito Fiscal', 'DNA2 - Emprendimientos Dinámicos', 'DNA2 - Expertos Pyme',
    'DNA2 - FONDEP', 'DNA2 - PAC Emprendedores', 'DNA2 - PAC Empresas', 'E-CERT', 'E-Ventanilla back',
    'E-Ventanilla front', 'Ecosistema 2', 'Egreso de Bienes', 'EITI', 'Ema', 'EMCe - Envio Masivo de Correos',
    'En Corral (compensación productores carne bovina)', 'ESIGA', 'Evaluación de Ofertas', 'Exporta Simple',
    'FATURI', 'Fisca Facil', 'Fiscalizaciones Moviles', 'Forestar', 'GANAR', 'Gertec', 'Gestion de Tabaco',
    'Impulso Tambero (compensación a productores de leche vacuna)', 'Impulso Tambero 2 (compensación a productores de leche vacuna)',
    'Influenza Aviar', 'Infoprod', 'Integraciones', 'Intranet', 'Intranet - mobile', 'Jimenez', 'LAMA',
    'Leviatan', 'Ley de Economia del Conocimiento', 'Ley de Gondolas', 'Linkgde', 'LUFE', 'Mectra',
    'MenosBrechaMasProduccion', 'Milegajo', 'Mira', 'Movimiento de Granos 37.13 (win32)',
    'Novedades de personal', 'ODOO Bienes Tecnologicos', 'ODOO Flota', 'ODOO Newsletter DG',
    'ODOO Newsletter RRHH', 'ODOO Plataforma Proyectos', 'ODOO UR', 'Patrimonio', 'Pesca NAcion',
    'Plan Lanar (compensación para productores Lana Ovina)', 'Plataforma Pymes Argentinas',
    'Portal de Carga de Datos Delegaciones', 'Portal Renaf', 'Portaldecarga', 'Precios Bovinos (win32)',
    'Precios Porcinos (win32)', 'Presentaciones', 'Programa Aporte nutrientes 2023',
    'PROGRAMA DE ASISTENCIA INMEDIATA A PRODUCTORES DEL CINTURÓN FRUTIHRTÍCOLA PLATENSE',
    'Programa fortalecimento productivo argentino – Sector Aves', 'Programa fortalecimento productivo argentino – Sector Porcino',
    'Proyectos', 'QA - ZABBIX', 'RADAR', 'RBAC', 'Regingaro', 'Regisfor', 'Registro Inversiones Mineras',
    'Registro Minero', 'Registro Pyme', 'Relevamiento Provinciales', 'RENACUA', 'Renaf Express',
    'Renapa', 'Renavi', 'RENOAF back', 'RENOAF front', 'RH Bot', 'Riesgo', 'RISE', 'RRHH Horas Extras',
    'RSI-IDP', 'Ruca', 'S. Integral de RRHH', 'Saldo Técnico IVA', 'Samla', 'Sello Bioproductos',
    'Sellos', 'SEPA', 'SGRRHH', 'SIACE', 'SIEC', 'Sif', 'Sif Mobile', 'Sifipa', 'Siglea', 'SiiP',
    'Sima', 'SINIE', 'Sintesis Productiva', 'Sio', 'Sio Carnes', 'Sio Carnes - Mobile', 'Sio Granos- Mobile',
    'SIPRE', 'SISCO neumáticos', 'Sisgral', 'Sist. Internos Telefónicos', 'SistemaDjec', 'SIUCAR',
    'Stock Ganadero', 'Suministros', 'Textiles', 'Tipificación', 'Traza', 'Usina', 'Viajes',
    'Warrants', 'Wsafip', 'WSRenaper', 'RICE', 'SIDIF', 'SIAF local', 'CAP (centro ayuda Pyme)',
    'Chatbot - TINA', 'Caravaneando', 'RENAI'
  ];

  for (const title of projectTitles) {
    const existing = await prisma.proyecto.findFirst({ where: { titulo: title } });
    if (!existing) {
      await prisma.proyecto.create({
        data: { titulo: title },
      });
    }
  }
  console.log('Project titles seeded.');

  // --- Seed Example Project ---
  console.log('Seeding example project...');

  const existingProject = await prisma.proyecto.findFirst({ where: { titulo: 'Proyecto SIGMA CRM' } });

  if (existingProject) {
    console.log('Example project "Proyecto SIGMA CRM" already exists.');
  } else {
    // 1. Get related data
    const dependenciaOrigen = await prisma.dependencia.findFirst({ where: { nombre: 'Industria' } });
    const categoria = await prisma.categoria.findFirst({ where: { nombre: 'Aplicativo' } });
    const subcategoria = await prisma.subcategoria.findFirst({ where: { nombre: 'Web' } });
    const staffMember = await prisma.staff.findFirst({ where: { email: 'dcolom@produccion.gob.ar' } });
    const lenguaje = await prisma.lenguaje.findFirst({ where: { nombre: 'TypeScript' } });
    const baseDeDatos = await prisma.baseDeDatos.findFirst({ where: { nombre: 'PostgreSQL' } });
    const controlVersiones = await prisma.controlVersiones.findFirst({ where: { nombre: 'GitHub' } });
    const statusPmo = await prisma.statusPmo.findFirst({ where: { nombre: 'en desarrollo' } });
    const statusSalud = await prisma.statusSalud.findFirst({ where: { nombre: 'buena' } });
    const alojamientoInfra = await prisma.alojamientoInfra.findFirst({ where: { nombre: 'AWS 01' } });

    if (!dependenciaOrigen || !categoria || !subcategoria || !staffMember || !lenguaje || !baseDeDatos || !controlVersiones || !statusPmo || !statusSalud || !alojamientoInfra) {
        console.error('Could not find all required seed data for project. Aborting project seed.');
    } else {
        // 2. Create the project
        await prisma.proyecto.create({
            data: {
                titulo: 'Proyecto SIGMA CRM',
                storyline: 'Un CRM para gestionar las relaciones con los clientes y los proyectos de la Subsecretaría.',
                activo: true,
                id_dependencia_origen: dependenciaOrigen.id,
                id_dependencia_actual: dependenciaOrigen.id,
                id_categoria: categoria.id,
                id_subcategoria: subcategoria.id,
                url_ticketera_interna: 'https://jira.example.com/SIGMA',
                url_ticketera_externa: 'https://servicedesk.example.com/SIGMA',
                tier: 1,
                urls: 'https://sigma-crm.example.com',
                cantidad_recursos_asignados: 5,
                // Create related Tecnologia
                tecnologia: {
                    create: {
                        id_control_versiones: controlVersiones.id,
                        changelog: true,
                        url_changelog: 'https://github.com/dcolombres/sigma-crm/blob/main/CHANGELOG.md',
                        id_alojamiento_infra: alojamientoInfra.id,
                        id_alojamiento_infra_db: alojamientoInfra.id, // Assuming same for DB
                        mantenimiento_soporte: true,
                        id_status_pmo: statusPmo.id,
                        id_status_salud: statusSalud.id,
                        anio_inicio_sistema: 2024,
                        usuarios_internos: 50,
                        usuarios_externos: 0,
                    }
                },
                // Connect to staff
                staff: {
                    create: {
                        id_staff: staffMember.id
                    }
                },
                // Connect to lenguajes
                lenguajes: {
                    create: {
                        id_lenguaje: lenguaje.id
                    }
                },
                // Connect to bases_de_datos
                bases_de_datos: {
                    create: {
                        id_base_de_datos: baseDeDatos.id
                    }
                }
            }
        });
        console.log('Example project "Proyecto SIGMA CRM" created successfully.');
    }
  }

  // --- Seed Example Client ---
  console.log('Seeding example client...');
  const existingClient = await prisma.cliente.findFirst({ where: { nombre: 'Cliente de Ejemplo S.A.' } });
  if (existingClient) {
    console.log('Example client already exists.');
  } else {
    const proyectoSigma = await prisma.proyecto.findFirst({ where: { titulo: 'Proyecto SIGMA CRM' } });
    if (proyectoSigma) {
      await prisma.cliente.create({
        data: {
          nombre: 'Cliente de Ejemplo S.A.',
          email: 'contacto@clienteejemplo.com',
          celular: '11-1234-5678',
          observacion: 'Este es un cliente de ejemplo para el proyecto CRM.',
          fecha_inicio_desarrollo: new Date(),
          activo: true,
          id_proyecto: proyectoSigma.id,
        }
      });
      console.log('Example client created.');
    } else {
      console.log('Could not find "Proyecto SIGMA CRM" to link client to.');
    }
  }

  // --- Seed Example Integration ---
  console.log('Seeding example integration...');
  const existingIntegration = await prisma.integracion.findFirst({ where: { nombre: 'API de GDE' } });
  if (existingIntegration) {
    console.log('Example integration already exists.');
  } else {
    const responsable = await prisma.staff.findFirst({ where: { email: 'dcolom@produccion.gob.ar' } });
    await prisma.integracion.create({
      data: {
        nombre: 'API de GDE',
        funcion_principal: 'Integración con el sistema de Gestión Documental Electrónica.',
        documentacion: 'https://developers.gde.example.com/docs',
        id_responsable: responsable?.id,
      }
    });
    console.log('Example integration created.');
  }

  console.log(`Seeding finished.`);
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });