import { Suspense } from 'react';
import ClientTable from '@/components/ClientesTable';
import { getClients, getClientsCount } from '@/lib/data';

interface ClientesPageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default async function ClientesPage({ searchParams }: ClientesPageProps) {
  const page = Number(searchParams.page) || 1;
  const perPage = 10;
  const search = searchParams.search || '';
  
  const [clients, count] = await Promise.all([
    getClients(page, perPage, search),
    getClientsCount(search)
  ]);

  const totalPages = Math.ceil(count / perPage);

  return (
    <main className="flex flex-col items-center w-full min-h-screen p-8 bg-background">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Gestión de Clientes</h1>
        </div>
        
        <Suspense fallback={<div>Loading...</div>}>
          <ClientTable 
            clients={clients} 
            currentPage={page}
            totalPages={totalPages}
          />
        </Suspense>
      </div>
    </main>
  );
}