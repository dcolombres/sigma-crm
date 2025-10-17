import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Import the server action from the project details page
import { TecnologiaForm } from '@/components/TecnologiaForm';

export default async function EditarTecnologiaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id_proyecto = Number(resolvedParams.id);
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
    <main className="flex flex-col items-center min-h-screen p-8 bg-background">
      <div className="w-full max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">Editar Tecnología del Proyecto</h1>
        <Link href={`/proyectos/${id_proyecto}`} className="text-sm font-medium text-primary hover:underline no-underline">
          Volver al Proyecto
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