import prisma from '@/lib/prisma';
import Link from 'next/link';
import { deleteClient } from '@/lib/actions';
import ClientesTable from '@/components/ClientesTable';
import { Prisma } from '@prisma/client';

export default async function ClientesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const perPage = 10;
  const sort = (resolvedSearchParams.sort as string) || 'nombre';
  const order = (resolvedSearchParams.order as Prisma.SortOrder) || 'asc';
  const search = (resolvedSearchParams.search as string) || '';

  const where: Prisma.ClienteWhereInput = search
    ? {
        OR: [
          { nombre: { contains: search } },
          { email: { contains: search } },
          { celular: { contains: search } },
        ],
      }
    : {};

  const [clientes, count] = await Promise.all([
    prisma.cliente.findMany({
      where,
      include: {
        proyecto: true,
      },
      orderBy: {
        [sort]: order,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.cliente.count({ where }),
  ]);

  return (
    <main className="flex flex-col items-center w-full min-h-screen p-8 bg-background">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Gestión de Clientes</h1>
          <Link href="/clientes/nuevo" className="px-4 py-2 font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75">
            + Añadir Cliente
          </Link>
        </div>

        <ClientesTable
          clientes={clientes}
          count={count}
          page={page}
          perPage={perPage}
          sort={sort}
          order={order}
          search={search}
          deleteClient={deleteClient}
        />
      </div>
    </main>
  );
}