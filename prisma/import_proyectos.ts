import { PrismaClient } from '@prisma/client';
import { getSheetData } from '../src/lib/google-sheets';

const prisma = new PrismaClient();

async function main() {
  const sheetData = await getSheetData('Proyectos');

  if (!sheetData) {
    console.log('No data found in sheet');
    return;
  }

  const clientes = await prisma.cliente.findMany();
  const staff = await prisma.staff.findMany();

  const clienteMap = new Map(clientes.map((c: any) => [c.nombre, c.id]));
  const staffMap = new Map(staff.map((s: any) => [`${s.nombres} ${s.apellidos}`, s.id]));

  // Skip header rows
  const dataRows = sheetData.slice(3);

  for (const [index, row] of dataRows.entries()) {
    if (!row || row.length === 0 || !row[0]) {
      console.log(`Skipping empty row at index ${index + 4}`);
      continue;
    }

    const id = parseInt(row[0], 10);

    if (isNaN(id)) {
      console.log(`Skipping row at index ${index + 4} with invalid ID: ${row[0]}`);
      continue;
    }

    const clienteNombre = row[6];
    const idCliente = clienteNombre ? clienteMap.get(clienteNombre) : null;

    const responsableNombre = row[13];
    const idResponsable = responsableNombre ? staffMap.get(responsableNombre) : null;

    const equipoNombres = row[8] ? row[8].split(',').map((name: string) => name.trim()) : [];
    const equipoIds = equipoNombres.map((name: string) => staffMap.get(name)).filter((id: any): id is number => id !== undefined);

    const proyectoData = {
      nombre: row[1],
      descripcion: row[2],
      origen: row[3],
      dependencia: row[4],
      tier: row[5],
      stack: row[7],
      status_salud: row[9],
      status_pmo: row[10],
      categoria: row[11],
      subcategoria: row[12],
      observacion: row[14],
      url_sistema: row[15],
      captura_url: row[16],
      nube: row[17],
      ticketera_interna: row[18],
      ticketera_externa: row[19],
      url_changelog: row[20],
      anio_inicio_sistema: row[21] ? parseInt(row[21], 10) : null,
      usuarios_internos: row[22] ? parseInt(row[22], 10) : null,
      usuarios_externos: row[23] ? parseInt(row[23], 10) : null,
      backend_lenguaje_principal: row[24],
      backend_version: row[25],
      backend_otro_lenguaje: row[26],
      backend_librerias: row[27],
      backend_framework: row[28],
      frontend_lenguaje_principal: row[29],
      frontend_version: row[30],
      frontend_otro_lenguaje: row[31],
      frontend_librerias: row[32],
      frontend_framework: row[33],
      db_tecnologia: row[34],
      db_version: row[35],
      db_tecnologia_2: row[36],
      db_tamanio: row[37],
      alojamiento_infra_db: row[38],
      db_backup: row[39],
      url_repositorio: row[41],
      infra_instrucciones_stack: row[42],
      alojamiento_infra: row[43],
      infra_alojamiento_hml: row[44],
      infra_alojamiento_tst: row[45],
      infra_contenedor: row[46],
      infra_vms: row[47],
      infra_instrucciones_deploy: row[48],
      infra_referente: row[49],
      infra_notas_adicionales: row[50],
      idCliente: idCliente,
      id_responsable: idResponsable,
    };

    const createData = {
      id,
      ...proyectoData,
      staff: {
        connect: equipoIds.map((id: number) => ({ id }))
      },
    };
    
    const updateData = {
        ...proyectoData,
        staff: {
            set: equipoIds.map((id: number) => ({ id }))
        },
    };

    await prisma.proyecto.upsert({
      where: { id },
      update: updateData,
      create: createData,
    });
  }

  console.log('Projects imported successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
