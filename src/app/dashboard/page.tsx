import { prisma } from '@/lib/prisma';
import Dashboard from '@/components/Dashboard';

export default async function Home() {
  console.log('DATABASE_URL in page.tsx:', process.env.DATABASE_URL);
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
    Promise.resolve([]), // Temporarily disabled: infraChartData
    Promise.resolve([]), // Temporarily disabled: dbChartData
    prisma.proyecto.groupBy({
      by: ['status_salud'],
      _count: {
        status_salud: true,
      },
      where: {
        status_salud: {
          not: null,
        },
      },
    }).then(data => data.map(item => ({
      id: item.status_salud!,
      label: `Tier ${item.status_salud}`,
      value: item._count.status_salud,
    }))),
  ]);

  // Fetch visibility settings from the first staff member
  const visibility = {};

  return (
    <Dashboard
      roleChartData={roleChartData}
      infraChartData={infraChartData}
      dbChartData={dbChartData}
      tierChartData={tierChartData}
    />
  );
}