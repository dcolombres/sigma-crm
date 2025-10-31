import ProyectoNewForm from '@/components/ProyectoNewForm';
import { createProject } from '@/lib/actions';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function NewProjectPage() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen p-8 bg-background">
      <div className="w-full max-w-6xl">
        <Breadcrumbs
          items={[
            { label: 'Proyectos', href: '/proyectos', isLast: false },
            {
              label: 'Nuevo Proyecto',
              href: '/proyectos/nuevo',
              isLast: true,
            },
          ]}
        />
        <div className="mt-8">
          <h1 className="text-3xl font-bold text-primary mb-8">Nuevo Proyecto</h1>
          <ProyectoNewForm createProject={createProject} />
        </div>
      </div>
    </main>
  );
}
