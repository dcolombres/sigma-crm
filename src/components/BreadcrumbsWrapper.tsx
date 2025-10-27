import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Breadcrumbs from './Breadcrumbs';

const getEntityName = async (segment: string, id: number) => {
  switch (segment) {
    case 'proyectos':
      const proyecto = await prisma.proyecto.findUnique({ where: { id }, select: { nombre: true } });
      return proyecto?.nombre || `#${id}`;
    case 'staff':
      const staff = await prisma.staff.findUnique({ where: { id }, select: { nombres: true, apellidos: true } });
      return staff ? `${staff.nombres} ${staff.apellidos}` : `#${id}`;
    case 'clientes':
      const cliente = await prisma.cliente.findUnique({ where: { id }, select: { nombre: true } });
      return cliente?.nombre || `#${id}`;

    default:
      return `#${id}`;
  }
};

export default async function BreadcrumbsWrapper() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const pathSegments = pathname.split('/').filter(segment => segment);

  const breadcrumbItems = await Promise.all(pathSegments.map(async (segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;
    const prevSegment = pathSegments[index - 1];

    let label = segment;
    const id = Number(segment);

    if (!isNaN(id) && prevSegment) {
      label = await getEntityName(prevSegment, id);
    }

    return { href, label, isLast };
  }));

  return <Breadcrumbs items={breadcrumbItems} />;
}
