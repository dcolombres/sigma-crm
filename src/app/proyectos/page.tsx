import { Suspense } from 'react';
import ProyectosTable from '@/components/ProyectosTable';
import { getProjects, getProjectsCount } from '@/lib/data';
import { deleteProject } from '@/lib/actions';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

interface ProyectosPageProps {
  searchParams: {
    page?: string;
    search?: string;
    sort?: string;
    order?: string;
  };
}

export default async function ProyectosPage({ searchParams }: ProyectosPageProps) {
  const page = Number(searchParams.page) || 1;
  const perPage = 10;
  const search = searchParams.search || '';
  const sort = searchParams.sort || 'nombre';
  const order = searchParams.order || 'asc';
  
  const [projects, count] = await Promise.all([
    getProjects(page, perPage, search),
    getProjectsCount(search)
  ]);

  const totalPages = Math.ceil(count / perPage);

  return (
    <main className="flex flex-col items-center w-full min-h-screen p-8 bg-background">
      <div className="w-full max-w-6xl">
        <Breadcrumbs
          items={[
            { label: 'Proyectos', href: '/proyectos', isLast: true },
          ]}
        />
        <div className="flex justify-between items-center my-8">
          <h1 className="text-3xl font-bold text-primary">Gestión de Proyectos</h1>
          <Link href="/proyectos/nuevo" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Nuevo Proyecto
          </Link>
        </div>
        
        <Suspense fallback={<div>Loading...</div>}>
          <ProyectosTable 
            proyectos={projects} 
            page={page}
            totalPages={totalPages}
            sort={sort}
            order={order}
            search={search}
            deleteProject={deleteProject}
          />
        </Suspense>
      </div>
    </main>
  );
}
