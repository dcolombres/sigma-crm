import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import Link from 'next/link';
import { deleteProject } from '@/lib/actions';
import ProyectosTable from '@/components/ProyectosTable';
import { FolderIcon } from '@heroicons/react/24/outline';

function getOrderBy(sort: string, order: Prisma.SortOrder) {
  if (sort === 'categoria') {
    return { categoria: { nombre: order } };
  }
  if (sort === 'dependenciaActual') {
    return { dependenciaActual: { nombre: order } };
  }
  return { [sort]: order };
}

export default async function ProyectosPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = Number(searchParams.page) || 1;
  const perPage = 10;
  const sort = (searchParams.sort as string) || 'id';
  const order = (searchParams.order as Prisma.SortOrder) || 'desc';
  const search = (searchParams.search as string) || '';

  const orderBy = getOrderBy(sort, order);

  // Add where clause for search
  const where: Prisma.ProyectoWhereInput = search
    ? {
        OR: [
          { titulo: { contains: search } },
          { storyline: { contains: search } },
        ],
      }
    : {};

  const [proyectos, count] = await Promise.all([
    prisma.proyecto.findMany({
      where, // Apply where clause
      include: {
        categoria: true,
        dependenciaActual: true,
        clientes: true,
      },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.proyecto.count({ where }), // Apply where clause to count
  ]);

  return (
    <main className="flex flex-col items-center w-full min-h-screen p-8 bg-background">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Gestión de Proyectos</h1>
          <Link href="/proyectos/nuevo" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary no-underline">
            <FolderIcon className="h-5 w-5 mr-2" />
            Crear Proyecto
          </Link>
        </div>

        <ProyectosTable
          proyectos={proyectos}
          count={count}
          page={page}
          perPage={perPage}
          sort={sort}
          order={order}
          search={search} // Pass search query to table
          deleteProject={deleteProject}
        />
      </div>
    </main>
  );
}