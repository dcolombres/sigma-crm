import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export default async function ProyectoLayout({ children, params }: { children: React.ReactNode, params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const proyecto = await prisma.proyecto.findUnique({
    where: { id },
  });

  if (!proyecto) {
    notFound();
  }

  const tabs = [
    { name: 'General', href: `/proyectos/${id}/editar` },
    { name: 'Tecnología', href: `/proyectos/${id}/tecnologia` },
    { name: 'Backend', href: `/proyectos/${id}/backend` },
    { name: 'Frontend', href: `/proyectos/${id}/frontend` },
    { name: 'Base de Datos', href: `/proyectos/${id}/database` },
  ];

  return (
    <main className="flex flex-col items-center w-full min-h-screen p-8 bg-background">
      <div className="w-full max-w-6xl">
        <Breadcrumbs
          items={[
            { label: 'Proyectos', href: '/proyectos', isLast: false },
            {
              label: proyecto.nombre,
              href: `/proyectos/${id}/editar`,
              isLast: true,
            },
          ]}
        />
        <div className="mt-8">
          <h1 className="text-3xl font-bold text-primary mb-8">{proyecto.nombre}</h1>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm no-underline`}
                >
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-8">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
