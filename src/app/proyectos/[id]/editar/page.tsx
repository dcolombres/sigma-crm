import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProyectoEditForm from '@/components/ProyectoEditForm';
import { updateProject } from '@/lib/actions';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  
  const [proyecto, clientes, staff] = await Promise.all([
    prisma.proyecto.findUnique({
      where: { id },
      include: {
        staff: true,
      },
    }),
    prisma.cliente.findMany(),
    prisma.staff.findMany(),
  ]);

  if (!proyecto) {
    notFound();
  }

  const updateProjectWithId = updateProject.bind(null, proyecto.id);

  return (
    <ProyectoEditForm
      proyecto={proyecto}
      clientes={clientes}
      staff={staff}
      updateProjectWithId={updateProjectWithId}
    />
  );
}
