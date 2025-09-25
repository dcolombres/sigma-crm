import Dashboard from '@/components/Dashboard';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // Fetch all data in parallel
  const [
    user, 
    staffRoleData,
    infraData,
    dbData,
    tierData
  ] = await Promise.all([
    // User data
    prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        staff: true,
      },
    }),
    // Chart 1: Staff Roles
    prisma.staff.groupBy({
      by: ['rol_staff'],
      _count: { _all: true },
      where: { rol_staff: { not: null } },
    }),
    // Chart 2: Infraestructura
    prisma.tecnologia.groupBy({
        by: ['id_alojamiento_infra'],
        _count: { _all: true },
        where: { id_alojamiento_infra: { not: null } },
    }),
    // Chart 3: Bases de Datos
    prisma.proyectoBaseDeDatos.groupBy({
        by: ['id_base_de_datos'],
        _count: { _all: true },
    }),
    // Chart 4: Tiers
    prisma.proyecto.groupBy({
        by: ['tier'],
        _count: { _all: true },
        where: { tier: { not: null } },
    })
  ]);

  // --- Format Chart Data ---

  // Roles
  const roleChartData = staffRoleData.map(item => ({
    id: item.rol_staff,
    value: item._count._all,
    label: item.rol_staff,
  }));

  // Infraestructura
  const infraIds = infraData.map(item => item.id_alojamiento_infra);
  const infraNames = await prisma.alojamientoInfra.findMany({
      where: { id: { in: infraIds } },
      select: { id: true, nombre: true }
  });
  const infraNameMap = new Map(infraNames.map(item => [item.id, item.nombre]));
  const infraChartData = infraData.map(item => ({
      id: item.id_alojamiento_infra,
      value: item._count._all,
      label: infraNameMap.get(item.id_alojamiento_infra) || 'Desconocido',
  }));

  // Bases de Datos
  const dbIds = dbData.map(item => item.id_base_de_datos);
  const dbNames = await prisma.baseDeDatos.findMany({
      where: { id: { in: dbIds } },
      select: { id: true, nombre: true }
  });
  const dbNameMap = new Map(dbNames.map(item => [item.id, item.nombre]));
  const dbChartData = dbData.map(item => ({
      id: item.id_base_de_datos,
      value: item._count._all,
      label: dbNameMap.get(item.id_base_de_datos) || 'Desconocido',
  }));

  // Tiers
  const tierChartData = tierData.map(item => ({
    id: item.tier,
    value: item._count._all,
    label: `Tier ${item.tier}`,
  }));

  return (
    <>
      <Dashboard 
        user={user} 
        roleChartData={roleChartData}
        infraChartData={infraChartData}
        dbChartData={dbChartData}
        tierChartData={tierChartData}
      />
    </>
  );
}
