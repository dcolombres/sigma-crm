import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
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

export default async function ProyectosList({
  searchParams,
}: {
  searchParams: {
    page?: string;
    sort?: string;
    order?: string;
    search?: string;
  };
}) {
  const page = Number(searchParams?.page) || 1;
  const perPage = 10;

  const allowedSortBy = ['id', 'titulo', 'storyline', 'activo', 'tier', 'categoria', 'dependenciaActual'];
  const sortBy = searchParams?.sort || 'id';
  const sort = allowedSortBy.includes(sortBy) ? sortBy : 'id';

  const allowedOrder = ['asc', 'desc'];
  const orderInput = searchParams?.order || 'desc';
  const order = allowedOrder.includes(orderInput) ? orderInput as Prisma.SortOrder : 'desc';

  const search = searchParams?.search || '';

  const orderBy = getOrderBy(sort, order);

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
      where,
      include: {
        categoria: true,
        dependenciaActual: true,
        clientes: true,
      },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.proyecto.count({ where }),
  ]);

  return (
    <ProyectosTable
      proyectos={proyectos}
      count={count}
      page={page}
      perPage={perPage}
      sort={sort}
      order={order}
      search={search}
    />
  );
}
