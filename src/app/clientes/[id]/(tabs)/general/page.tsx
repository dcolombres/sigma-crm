import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ClienteGeneralForm from '@/components/ClienteGeneralForm';
import { updateClient } from '@/lib/actions';

export default async function ClienteGeneralPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const cliente = await prisma.cliente.findUnique({
    where: { id },
  });

  if (!cliente) {
    notFound();
  }

  const updateClientWithId = updateClient.bind(null, cliente.id);

  return (
    <ClienteGeneralForm cliente={cliente} action={updateClientWithId} />
  );
}
