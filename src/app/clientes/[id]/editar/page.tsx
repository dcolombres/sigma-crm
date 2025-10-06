import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { updateClient } from '@/lib/actions';
import ClienteEditForm from '@/components/ClienteEditForm';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarClientePage({ params }: EditPageProps) {
  const { id: idString } = await params;
  const id = Number(idString);
  if (isNaN(id)) return notFound();

  const [client, proyectos] = await Promise.all([
    prisma.cliente.findUnique({ where: { id } }),
    prisma.proyecto.findMany({ orderBy: { titulo: 'asc' } }),
  ]);

  if (!client) return notFound();

  const updateClientWithId = updateClient.bind(null, client.id);

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-background">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Editar Cliente: {client.nombre}</h1>
            <Link href="/clientes" className="text-sm font-medium text-primary hover:underline">
                &larr; Volver a la lista
            </Link>
        </div>
        
        <ClienteEditForm
          client={client}
          proyectos={proyectos}
          updateClientWithId={updateClientWithId}
        />
      </div>
    </main>
  );
}