import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BackendForm from '@/components/BackendForm';
import { updateProject } from '@/lib/actions';

export default async function BackendPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  
  const [proyecto, alojamientosInfra] = await Promise.all([
    prisma.proyecto.findUnique({ where: { id } }),
    prisma.dPR_AlojamientoInfra.findMany(),
  ]);

  if (!proyecto) {
    notFound();
  }

  const updateProjectWithId = updateProject.bind(null, proyecto.id);

  return (
    <BackendForm
      proyecto={proyecto}
      alojamientosInfra={alojamientosInfra}
      updateProjectWithId={updateProjectWithId}
    />
  );
}
