import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ClienteEditForm from '@/components/ClienteEditForm';
import { updateClient } from '@/lib/actions';

export default async function EditarClientePage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    notFound();
  }

  const cliente = await prisma.cliente.findUnique({ where: { id } });

  if (!cliente) {
    notFound();
  }

  const updateClientWithId = updateClient.bind(null, cliente.id);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Editar Cliente</h1>
        <ClienteEditForm client={cliente} updateClientWithId={updateClientWithId} />
      </div>
    </main>
  );
}