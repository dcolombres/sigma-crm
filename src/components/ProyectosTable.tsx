'use client';

import Link from 'next/link';
import { Proyecto, Cliente } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import Pagination from './Pagination';
import ResponsiveTable from './ResponsiveTable';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// Define the props, removing visibleColumns
interface ProyectosTableProps {
  proyectos: (Proyecto & { cliente: Cliente | null })[];
  page: number;
  totalPages: number;
  sort: string;
  order: string;
  search: string;
  deleteProject: (id: number, prevState: any, formData: FormData) => Promise<{ message: string; error: boolean; }>;
}

// A dedicated row component for better state management, like in ClientesTable
function ProyectoTableRow({ proyecto, deleteProject }: { proyecto: ProyectosTableProps['proyectos'][0], deleteProject: ProyectosTableProps['deleteProject'] }) {
  const initialState = { message: "", error: false };
  // Bind the project ID to the delete action
  const deleteProjectWithId = deleteProject.bind(null, proyecto.id);
  const [state, dispatch] = useFormState(deleteProjectWithId, initialState);

  useEffect(() => {
    if (state.message) {
      if (state.error) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
      }
    }
  }, [state]);

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <Link href={`/proyectos/${proyecto.id}/editar`} className="no-underline">
          {proyecto.nombre}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proyecto.cliente?.nombre || 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proyecto.codigo_trazabilidad}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proyecto.descripcion}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
        <Link href={`/proyectos/${proyecto.id}/editar`} className="text-primary hover:text-primary-dark no-underline p-2">
          <PencilIcon className="h-5 w-5" />
        </Link>
        <form action={dispatch}>
          <button type="submit" className="p-2">
            <TrashIcon className="h-5 w-5 text-danger" />
          </button>
        </form>
      </td>
    </tr>
  );
}

export default function ProyectosTable({ proyectos, page, totalPages, sort, order, search, deleteProject }: ProyectosTableProps) {
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
            placeholder="Buscar por título, storyline..."
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
              <Link href={createSortURL('nombre')} className="no-underline">Nombre</Link>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Link href={createSortURL('cliente.nombre')} className="no-underline">Cliente</Link>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Link href={createSortURL('codigo_trazabilidad')} className="no-underline">Código Trazabilidad</Link>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Link href={createSortURL('descripcion')} className="no-underline">Descripción</Link>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {proyectos.length > 0 ? (
            proyectos.map((proyecto) => (
              <ProyectoTableRow key={proyecto.id} proyecto={proyecto} deleteProject={deleteProject} />
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                No hay proyectos para mostrar. ¡Añade uno nuevo!
              </td>
            </tr>
          )}
        </tbody>
      </ResponsiveTable>
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}
