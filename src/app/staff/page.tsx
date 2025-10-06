import prisma from '@/lib/prisma';
import Link from 'next/link';
import { deleteStaff } from '@/lib/actions';
import StaffTable from '@/components/StaffTable';
import { Prisma } from '@prisma/client';

export default async function StaffPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const perPage = 10;
  const sort = (resolvedSearchParams.sort as string) || 'nombre_completo';
  const order = (resolvedSearchParams.order as string) || 'asc';
  const search = (resolvedSearchParams.search as string) || '';

  const where: Prisma.StaffWhereInput = search
    ? {
        OR: [
          { nombre_completo: { contains: search } },
          { email: { contains: search } },
          { rol_staff: { contains: search } },
        ],
      }
    : {};

  const [staff, count] = await Promise.all([
    prisma.staff.findMany({
      where,
      orderBy: {
        [sort]: order,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.staff.count({ where }),
  ]);

  return (
    <main className="flex flex-col items-center w-full min-h-screen p-8 bg-background">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Gestión de Staff</h1>
          <Link href="/staff/nuevo" className="px-4 py-2 font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75">
            + Añadir Persona
          </Link>
        </div>

        <StaffTable
          staff={staff}
          count={count}
          page={page}
          perPage={perPage}
          sort={sort}
          order={order}
          search={search}
          deleteStaff={deleteStaff}
        />
      </div>
    </main>
  );
}