import prisma from '@/lib/prisma';
import Link from 'next/link';
import { createClient } from '@/lib/actions';
import ClienteNewForm from '@/components/ClienteNewForm';

export default async function NuevoClientePage({ searchParams }: { searchParams: Promise<{ id_proyecto?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const proyectos = await prisma.proyecto.findMany({ orderBy: { titulo: 'asc' } });
  const preselectedProjectId = resolvedSearchParams.id_proyecto;

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-background">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Añadir Nuevo Cliente</h1>
            <Link href="/clientes" className="text-sm font-medium text-primary hover:underline">
                &larr; Volver a la lista
            </Link>
        </div>
        
        <ClienteNewForm
          createClient={createClient}
          proyectos={proyectos}
          preselectedProjectId={preselectedProjectId}
        />
      </div>
    </main>
  );
}
