import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

// Import the server action from the project details page
import { TecnologiaForm } from '@/components/TecnologiaForm';

// Import the server action from the project details page
export default async function EditarTecnologiaPage({ params }: EditPageProps) {
  const id_proyecto = Number(params.id);
  if (isNaN(id_proyecto)) return notFound();

  const [tecnologia, controlVersiones, statusPmo, statusSalud, alojamientoInfra, alojamientoInfraDB] = await Promise.all([
    prisma.tecnologia.findUnique({ where: { id_proyecto: id_proyecto } }),
    prisma.controlVersiones.findMany({ orderBy: { nombre: 'asc' } }),
    prisma.statusPmo.findMany({ orderBy: { nombre: 'asc' } }),
    prisma.statusSalud.findMany({ orderBy: { nombre: 'asc' } }),
    prisma.alojamientoInfra.findMany({ orderBy: { nombre: 'asc' } }), // New fetch
    prisma.alojamientoInfraDB.findMany({ orderBy: { nombre: 'asc' } }), // New fetch
  ]);

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {tecnologia ? `Editar Tecnología para ${id_proyecto}` : `Añadir Tecnología al Proyecto ${id_proyecto}`}
          </h1>
          <Link href={`/proyectos/${id_proyecto}`} className="text-sm font-medium text-blue-600 hover:underline">
            &larr; Volver al Proyecto
          </Link>
        </div>
        
        <TecnologiaForm 
          id_proyecto={id_proyecto}
          tecnologia={tecnologia}
          controlVersiones={controlVersiones}
          statusPmo={statusPmo}
          statusSalud={statusSalud}
          alojamientoInfra={alojamientoInfra}
          alojamientoInfraDB={alojamientoInfraDB}
        />
      </div>
    </main>
  );
}