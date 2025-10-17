'use client';

import Link from 'next/link';
import { Cliente, Proyecto } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import Pagination from './Pagination';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ClientesTableProps {
  clientes: (Cliente & { proyecto: Proyecto })[];
  count: number;
  page: number;
  perPage: number;
  sort: string;
  order: string;
  search: string;
  deleteClient: (id: number, prevState: { message: string; error: boolean; }, formData: FormData) => Promise<{ message: string; error: boolean; }>;
}

function DeleteClientButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      <TrashIcon className="h-5 w-5 text-danger" />
    </button>
  );
}

function ClienteTableRow({ cliente, deleteClient }: { cliente: ClientesTableProps['clientes'][0], deleteClient: ClientesTableProps['deleteClient'] }) {
  const initialState = { message: "", error: false };
  const [state, dispatch] = useFormState(deleteClient.bind(null, cliente.id), initialState);

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
        <Link href={`/clientes/${cliente.id}/editar`} className="no-underline">
          {cliente.nombre}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.email}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.celular}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <Link href={`/proyectos/${cliente.proyecto.id}`} className="no-underline">
          {cliente.proyecto.titulo}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
        <Link href={`/clientes/${cliente.id}/editar`} className="text-primary hover:text-primary-dark no-underline p-2">
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

import ResponsiveTable from './ResponsiveTable';

export default function ClientesTable({ clientes, count, page, perPage, sort, order, search, deleteClient }: ClientesTableProps) {
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
            placeholder="Buscar por nombre, email o celular..."
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
              <Link href={createSortURL('email')} className="no-underline">Email</Link>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Link href={createSortURL('celular')} className="no-underline">Celular</Link>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Proyecto Asociado
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <ClienteTableRow key={cliente.id} cliente={cliente} deleteClient={deleteClient} />
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                No hay clientes para mostrar. ¡Añade uno nuevo!
              </td>
            </tr>
          )}
        </tbody>
      </ResponsiveTable>
      <Pagination count={count} page={page} perPage={perPage} />
    </div>
  );
}