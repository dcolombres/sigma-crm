'use client';

import Link from 'next/link';
import { Proyecto, Categoria, Dependencia, Cliente } from '@prisma/client';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Pagination from './Pagination';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ProyectosTableProps {
  proyectos: (Proyecto & { categoria: Categoria | null; dependenciaActual: Dependencia | null; clientes: Cliente[] })[];
  count: number;
  page: number;
  perPage: number;
  sort: string;
  order: string;
  search: string;
  deleteProject: (id: number, prevState: { message: string; error: boolean; }, formData: FormData) => Promise<{ message: string; error: boolean; }>;
}

import ResponsiveTable from './ResponsiveTable';

function DeleteProjectButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      <TrashIcon className="h-5 w-5 text-danger" />
    </button>
  );
}

export default function ProyectosTable({ proyectos, count, page, perPage, sort, order, search, deleteProject }: ProyectosTableProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(search);

  const createSortURL = (sortValue: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sortValue);
    params.set('order', sort === sortValue && order === 'asc' ? 'desc' : 'asc');
    return `${pathname}?${params.toString()}`;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('search', searchValue);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };
  
  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  return (
    <div>
      <div className="mb-4 relative">
        <form onSubmit={handleSearchSubmit}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={searchValue}
            onChange={handleSearchChange}
            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 pl-10"
          />
        </form>
      </div>
      <ResponsiveTable>
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Link href={createSortURL('titulo')} className="no-underline">Título</Link>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Link href={createSortURL('categoria')} className="no-underline">Categoría</Link>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Link href={createSortURL('dependenciaActual')} className="no-underline">Dependencia</Link>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Link href={createSortURL('activo')} className="no-underline">Estado</Link>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {proyectos.length > 0 ? (
            proyectos.map((proyecto) => (
              <tr key={proyecto.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link href={`/proyectos/${proyecto.id}`} className="no-underline">
                    {proyecto.titulo}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proyecto.clientes?.[0]?.nombre ?? 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proyecto.categoria?.nombre ?? 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proyecto.dependenciaActual?.nombre ?? 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold ${proyecto.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {proyecto.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                  <Link href={`/proyectos/${proyecto.id}/editar`} className="text-primary hover:text-primary-dark no-underline p-2">
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                  <form action={deleteProject.bind(null, proyecto.id)}>
                    <button type="submit" className="p-2">
                      <TrashIcon className="h-5 w-5 text-danger" />
                    </button>
                  </form>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-10 text-muted">
                No hay proyectos para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </ResponsiveTable>
      <Pagination count={count} page={page} perPage={perPage} />
    </div>
  );
}
