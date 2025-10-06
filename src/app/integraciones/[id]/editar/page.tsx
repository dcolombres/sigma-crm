import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { updateIntegration } from '@/lib/actions';
import IntegracionEditForm from '@/components/IntegracionEditForm';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarIntegracionPage({ params }: EditPageProps) {
  const { id: idString } = await params;
  const id = Number(idString);
  if (isNaN(id)) return notFound();

  const [integracion, staff] = await Promise.all([
    prisma.integracion.findUnique({ where: { id } }),
    prisma.staff.findMany({ orderBy: { nombre_completo: 'asc' } }),
  ]);

  if (!integracion) return notFound();

  const updateIntegrationWithId = updateIntegration.bind(null, integracion.id);

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-background">
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Editar Integración: {integracion.nombre}</h1>
            <Link href="/integraciones" className="text-sm font-medium text-primary hover:underline">
                &larr; Volver a la lista
            </Link>
        </div>
        
        <IntegracionEditForm
          integracion={integracion}
          staff={staff}
          updateIntegrationWithId={updateIntegrationWithId}
        />
      </div>
    </main>
  );
}