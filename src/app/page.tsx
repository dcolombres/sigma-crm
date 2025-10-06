import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import prisma from '@/lib/prisma';
import Dashboard from '@/components/Dashboard';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <div>Not authenticated</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { staff: true },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  // Fetch data for charts
  const [roleChartData, infraChartData, dbChartData, tierChartData] = await Promise.all([
    prisma.staff.groupBy({
      by: ['rol_staff'],
      _count: {
        rol_staff: true,
      },
    }).then(data => data.map(item => ({
      id: item.rol_staff || 'N/A',
      label: item.rol_staff || 'N/A',
      value: item._count.rol_staff,
    }))),
    prisma.tecnologia.groupBy({
      by: ['id_alojamiento_infra'],
      _count: {
        id_alojamiento_infra: true,
      },
      where: {
        id_alojamiento_infra: {
          not: null,
        },
      },
    }).then(async data => {
      const infraNames = await prisma.alojamientoInfra.findMany({
        where: {
          id: {
            in: data.map(item => item.id_alojamiento_infra!),
          },
        },
        select: { id: true, nombre: true },
      });
      const nameMap = new Map(infraNames.map(infra => [infra.id, infra.nombre]));
      return data.map(item => ({
        id: item.id_alojamiento_infra!,
        label: nameMap.get(item.id_alojamiento_infra!) || `ID ${item.id_alojamiento_infra}`,
        value: item._count.id_alojamiento_infra,
      }));
    }),
    prisma.tecnologia.groupBy({
      by: ['id_alojamiento_infra_db'],
      _count: {
        id_alojamiento_infra_db: true,
      },
      where: {
        id_alojamiento_infra_db: {
          not: null,
        },
      },
    }).then(async data => {
      const dbNames = await prisma.alojamientoInfraDB.findMany({
        where: {
          id: {
            in: data.map(item => item.id_alojamiento_infra_db!),
          },
        },
        select: { id: true, nombre: true },
      });
      const nameMap = new Map(dbNames.map(db => [db.id, db.nombre]));
      return data.map(item => ({
        id: item.id_alojamiento_infra_db!,
        label: nameMap.get(item.id_alojamiento_infra_db!) || `ID ${item.id_alojamiento_infra_db}`,
        value: item._count.id_alojamiento_infra_db,
      }));
    }),
    prisma.proyecto.groupBy({
      by: ['tier'],
      _count: {
        tier: true,
      },
      where: {
        tier: {
          not: null,
        },
      },
    }).then(data => data.map(item => ({
      id: item.tier!,
      label: `Tier ${item.tier}`,
      value: item._count.tier,
    }))),
  ]);

  return (
    <Dashboard
      user={user}
      roleChartData={roleChartData}
      infraChartData={infraChartData}
      dbChartData={dbChartData}
      tierChartData={tierChartData}
    />
  );
}