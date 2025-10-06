import prisma from '@/lib/prisma';
import Link from 'next/link';
import { createIntegration } from '@/lib/actions';
import IntegracionNewForm from '@/components/IntegracionNewForm';

export default async function NuevoIntegracionPage() {
  const staff = await prisma.staff.findMany({ orderBy: { nombre_completo: 'asc' } });

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-background">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Añadir Nueva Integración</h1>
            <Link href="/integraciones" className="text-sm font-medium text-primary hover:underline">
                &larr; Volver a la lista
            </Link>
        </div>
        
        <IntegracionNewForm
          createIntegration={createIntegration}
          staff={staff}
        />
      </div>
    </main>
  );
}