import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import StaffGeneralForm from '@/components/StaffGeneralForm';

export default async function StaffPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const staff = await prisma.staff.findUnique({
    where: { id },
  });

  if (!staff) {
    notFound();
  }

  const tabs = [
    { name: 'General', href: `/staff/${id}` },
    { name: 'Contrato', href: `/staff/${id}/contrato` },
    { name: 'Desempeño', href: `/staff/${id}/desempeno` },
    { name: 'Proyectos', href: `/staff/${id}/proyectos` },
  ];

  return (
    <main className="flex flex-col items-center w-full min-h-screen p-8 bg-background">
      <div className="w-full max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">{`${staff.nombres} ${staff.apellidos}`}</h1>
        </div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={`border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm no-underline ${
                  tab.name === 'General' ? 'border-primary text-primary' : ''
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8">
          <StaffGeneralForm staff={staff} />
        </div>
      </div>
    </main>
  );
}
