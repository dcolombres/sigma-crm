import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { deleteProject, deleteTecnologia } from '@/lib/actions';
import ProyectoDetail from '@/components/ProyectoDetail';

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProyectoDetailPage({ params }: DetailPageProps) {
  const { id: idString } = await params;
  const id = Number(idString);
  if (isNaN(id)) {
    return notFound();
  }

  const proyecto = await prisma.proyecto.findUnique({
    where: { id },
    include: {
      categoria: true,
      subcategoria: true,
      dependenciaOrigen: true,
      dependenciaActual: true,
      tecnologia: {
        include: {
          controlVersiones: true,
          statusPmo: true,
          statusSalud: true,
          alojamientoInfra: true,
          alojamientoInfraDB: true,
        },
      },
      staff: { include: { staff: true } },
      clientes: true,
    },
  });

  if (!proyecto) {
    return notFound();
  }

  const allStaff = await prisma.staff.findMany();

  const deleteProjectWithId = deleteProject.bind(null, proyecto.id);
  const deleteTecnologiaWithId = deleteTecnologia.bind(null, proyecto.id);

  return (
    <ProyectoDetail
      proyecto={proyecto}
      allStaff={allStaff}
      deleteProjectWithId={deleteProjectWithId}
      deleteTecnologiaWithId={deleteTecnologiaWithId}
    />
  );
}