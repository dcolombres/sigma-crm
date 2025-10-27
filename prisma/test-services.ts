import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testServices() {
  console.log('Iniciando verificación de conectividad de servicios externos...');

  const user = await prisma.user.findUnique({
    where: { email: 'dcolom@produccion.gob.ar' },
  });

  if (!user) {
    console.error('No se encontró el usuario dcolom@produccion.gob.ar en la base de datos.');
    process.exit(1);
  }

  console.log('⚪ Verificación de servicios externos deshabilitada (Redmine, GitLab, Telegram, etc.).');

}

testServices()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });