import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import FrontendForm from '@/components/FrontendForm';
import { updateProject } from '@/lib/actions';

export default async function FrontendPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  
  const proyecto = await prisma.proyecto.findUnique({ where: { id } });

  if (!proyecto) {
    notFound();
  }

  const updateProjectWithId = updateProject.bind(null, proyecto.id);

  return (
    <FrontendForm
      proyecto={proyecto}
      updateProjectWithId={updateProjectWithId}
    />
  );
}
