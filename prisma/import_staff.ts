import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Helper to convert string to boolean
const toBoolean = (str: string) => str.toLowerCase() === 'true' || str.toLowerCase() === 'si';

// Helper to convert string to number or null
const toNumberOrNull = (str: string) => {
  if (str === '' || isNaN(Number(str))) return null;
  return Number(str);
};

// Helper to convert DD/MM/AAAA to ISO date string
const toISOStringOrNull = (str: string) => {
  if (!str) return null;
  const parts = str.split('/');
  if (parts.length !== 3) return null;
  // Note: new Date(year, monthIndex, day)
  const date = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  return date.toISOString();
};

async function main() {
  console.log(`Start importing staff...`);

  const filePath = path.join(process.cwd(), '../staff.csv');

  if (!fs.existsSync(filePath)) {
    console.error(`File not found at ${filePath}`);
    console.error('Please make sure the staff_template.csv file is in the /Users/dcolom/DSIGMA/ directory.');
    return;
  }

  const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

  const rows = fileContent.split('\n').slice(1);

  for (const row of rows) {
    if (!row.trim()) continue; // Skip empty rows

    const values = row.split(',').map(field => field.trim());
    const [
      nombre_completo,
      contrato,
      rol_staff,
      nombres,
      apellidos,
      activo_str,
      comentario,
      proyectos_q_str,
      modalidad,
      experiencia,
      origen,
      email,
      skills,
      desempeno_ley_dto,
      hhee_str,
      ur_str,
      coordinacion,
      presencialidad,
      cumpleanos_str,
      edad_str,
    ] = values;

    if (!nombre_completo || !email) {
      console.warn(`Skipping invalid row (missing name or email): ${row}`);
      continue;
    }

    const staffData = {
      nombre_completo,
      email,
      contrato: contrato || null,
      rol_staff: rol_staff || null,
      nombres: nombres || null,
      apellidos: apellidos || null,
      activo: activo_str ? toBoolean(activo_str) : null,
      comentario: comentario || null,
      proyectos_q: toNumberOrNull(proyectos_q_str),
      modalidad: modalidad || null,
      experiencia: experiencia || null,
      origen: origen || null,
      skills: skills || null,
      desempeno_ley_dto: desempeno_ley_dto || null,
      hhee: hhee_str ? toBoolean(hhee_str) : null,
      ur: ur_str ? toBoolean(ur_str) : null,
      coordinacion: coordinacion || null,
      presencialidad: presencialidad || null,
      cumpleanos: toISOStringOrNull(cumpleanos_str),
      edad: toNumberOrNull(edad_str),
    };

    try {
      // Create or update staff
      const staff = await prisma.staff.upsert({
        where: { email },
        update: staffData,
        create: staffData,
      });
      console.log(`Successfully created/updated staff: ${staff.nombre_completo} (${staff.email})`);

      // Create a corresponding user if it doesn't exist
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        await prisma.user.create({
          data: {
            email: email,
            password: 'password', // Default password, user should change it
            rol: rol_staff || 'user', // Use staff role as user role, or default to 'user'
            staffId: staff.id,
          },
        });
        console.log(`Successfully created user for: ${email}`);
      }

    } catch (error) {
      console.error(`Failed to process staff ${nombre_completo}:`, error);
    }
  }

  console.log(`Finished importing staff.`);
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
