import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import Link from 'next/link';
import ProyectosTable from '@/components/ProyectosTable';

function getOrderBy(sort: string, order: Prisma.SortOrder) {
  if (sort === 'categoria') {
    return { categoria: { nombre: order } };
  }
  if (sort === 'dependenciaActual') {
    return { dependenciaActual: { nombre: order } };
  }
  return { [sort]: order };
}

export default async function ProyectosPageComponent({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = Number(searchParams.page) || 1;
  const perPage = 10;
  
  const allowedSortBy = ['id', 'titulo', 'storyline', 'activo', 'tier', 'categoria', 'dependenciaActual'];
  const sortBy = (searchParams.sort as string) || 'id';
  const sort = allowedSortBy.includes(sortBy) ? sortBy : 'id';

  const allowedOrder = ['asc', 'desc'];
  const orderInput = (searchParams.order as string) || 'desc';
  const order = allowedOrder.includes(orderInput) ? orderInput as Prisma.SortOrder : 'desc';

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
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Gestión de Proyectos</h1>
        <Link href="/proyectos/nuevo" className="px-4 py-2 font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75">
            + Crear Proyecto
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
      />
    </div>
  );
}