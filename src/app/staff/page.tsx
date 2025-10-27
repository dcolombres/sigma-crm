import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import Link from 'next/link';
import StaffTable from '@/components/StaffTable';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { deleteStaff } from '@/lib/actions';

export default async function StaffPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams.page) || 1;
  const perPage = 10;
  const sort = (searchParams.sort as string) || 'nombres';
  const order = (searchParams.order as 'asc' | 'desc') || 'asc';
  const search = (searchParams.search as string) || '';

  const where: Prisma.StaffWhereInput = search
    ? {
        OR: [
          { nombres: { contains: search, mode: 'insensitive' } },
          { apellidos: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { rol_staff: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const [staff, count] = await prisma.$transaction([
    prisma.staff.findMany({
      where,
      include: {
        proyectos: true,
      },
      orderBy: {
        [sort]: order,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.staff.count({ where }),
  ]);

  const totalPages = Math.ceil(count / perPage);

  return (
    <main className="flex flex-col items-center w-full min-h-screen p-8 bg-background">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Gestión de Staff</h1>
          <Link
            href="/staff/nuevo"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary no-underline"
          >
            <UserGroupIcon className="h-5 w-5 mr-2" />
            Añadir Persona
          </Link>
        </div>

        <StaffTable
          staff={staff}
          page={page}
          totalPages={totalPages}
          sort={sort}
          order={order}
          search={search}
          deleteStaff={deleteStaff}
        />
      </div>
    </main>
  );
}
