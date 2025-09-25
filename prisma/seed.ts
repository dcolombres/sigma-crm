import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Seed Staff
  const users = [
    {
      id: 1,
      nombre_completo: 'Default User',
      email: 'user@example.com',
      password: 'password', // TODO: Hash passwords
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
      id: 2,
      nombre_completo: 'dcolom',
      email: 'dcolom@produccion.gob.ar',
      password: 'password', // TODO: Hash passwords
      rol: 'administrador',
    }
  ];

  for (const user of users) {
    await prisma.staff.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }

  // Seed Dependencias
  const dependencias = [
    'Industria', 'Pyme', 'Produccion', 'Energia', 'Mineria', 'Magyp', 'Inti', 'INPI', 'Ec del Conocimiento', 'Comercio', 'Pesca', 'otro'
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