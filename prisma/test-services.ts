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

  // --- Redmine ---
  if (user.redmine_url && user.redmine_api_key) {
    try {
      console.log(`Verificando Redmine: ${user.redmine_url}...`);
      const response = await fetch(`${user.redmine_url}/my/account.json`, {
        headers: { 'X-Redmine-API-Key': user.redmine_api_key },
      });
      if (response.ok) {
        console.log('✅ Redmine: Conexión exitosa.');
      } else {
        console.error(`❌ Redmine: Falló la conexión (Estado: ${response.status})`);
      }
    } catch (error) {
      console.error('❌ Redmine: Error de red o DNS.', error);
    }
  } else {
    console.log('⚪ Redmine: No configurado.');
  }

  // --- GitLab ---
  if (user.gitlab_url && user.gitlab_api_key) {
    try {
      console.log(`Verificando GitLab: ${user.gitlab_url}...`);
      const response = await fetch(`${user.gitlab_url}/api/v4/version`, {
        headers: { 'PRIVATE-TOKEN': user.gitlab_api_key },
      });
      if (response.ok) {
        console.log('✅ GitLab: Conexión exitosa.');
      } else {
        console.error(`❌ GitLab: Falló la conexión (Estado: ${response.status})`);
      }
    } catch (error) {
      console.error('❌ GitLab: Error de red o DNS.', error);
    }
  } else {
    console.log('⚪ GitLab: No configurado.');
  }

  // --- Telegram ---
  if (user.telegram_bot_token) {
    try {
      console.log('Verificando Telegram...');
      const response = await fetch(`https://api.telegram.org/bot${user.telegram_bot_token}/getMe`);
      const data = await response.json();
      if (data.ok) {
        console.log(`✅ Telegram: Conexión exitosa (Bot: ${data.result.username}).`);
      } else {
        console.error(`❌ Telegram: Falló la conexión (${data.description})`);
      }
    } catch (error) {
      console.error('❌ Telegram: Error de red o DNS.', error);
    }
  } else {
    console.log('⚪ Telegram: No configurado.');
  }

}

testServices()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
