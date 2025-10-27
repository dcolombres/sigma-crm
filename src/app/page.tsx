import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import Link from 'next/link';
import ProyectosTable from '@/components/ProyectosTable';
import { FolderIcon } from '@heroicons/react/24/outline';
import { deleteProject } from '@/lib/actions';

export default async function ProyectosPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams.page) || 1;
  const perPage = 10;
  const sort = (searchParams.sort as string) || 'id';
  const order = (searchParams.order as 'asc' | 'desc') || 'desc';
  const search = (searchParams.search as string) || '';

  const where: Prisma.ProyectoWhereInput = search
    ?
    {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { descripcion: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const [proyectosData, count] = await prisma.$transaction([
    prisma.proyecto.findMany({
      where,
      include: {
        clientes: true,
        staff: true,
      },
      orderBy: {
        [sort]: order,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.proyecto.count({ where }),
  ]);

  const proyectos = proyectosData.map(p => ({
    ...p,
    cliente: p.clientes[0] || null,
  }));

  const totalPages = Math.ceil(count / perPage);

  return (
    <main className="flex flex-col items-center w-full min-h-screen p-8 bg-background">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Gestión de Proyectos</h1>
          <Link
            href="/proyectos/nuevo"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary no-underline"
          >
            <FolderIcon className="h-5 w-5 mr-2" />
            Crear Proyecto
          </Link>
        </div>

        <ProyectosTable
          proyectos={proyectos}
          page={page}
          totalPages={totalPages}
          sort={sort}
          order={order}
          search={search}
          deleteProject={deleteProject}
        />
      </div>
    </main>
  );
}