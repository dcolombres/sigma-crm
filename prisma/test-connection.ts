import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Intentando conectar a la base de datos...');
    await prisma.$connect();
    console.log('¡Conexión exitosa!');

    console.log('Ejecutando una consulta simple...');
    const user = await prisma.user.findFirst();
    if (user) {
      console.log(`Consulta exitosa. Se encontró al menos un usuario: ${user.email}`);
    } else {
      console.log('La consulta se ejecutó, pero no se encontraron usuarios.');
    }

  } catch (error) {
    console.error('Error durante la prueba de conexión:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('Conexión cerrada.');
  }
}

testConnection();
