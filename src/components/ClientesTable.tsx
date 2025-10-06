'use client';

import Link from 'next/link';
import { Cliente, Proyecto } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import Pagination from './Pagination';

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
    <button type="submit" disabled={pending} className="text-red-600 hover:underline disabled:text-red-400">
      {pending ? 'Eliminando...' : 'Eliminar'}
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
    <tr className="border-b hover:bg-background">
      <td className="px-6 py-4 font-medium text-primary">
        <Link href={`/clientes/${cliente.id}/editar`} className="hover:underline">
          {cliente.nombre}
        </Link>
      </td>
      <td className="px-6 py-4 text-secondary">{cliente.email}</td>
      <td className="px-6 py-4 text-secondary">{cliente.celular}</td>
      <td className="px-6 py-4 text-secondary">
        <Link href={`/proyectos/${cliente.proyecto.id}`} className="text-primary hover:underline">
          {cliente.proyecto.titulo}
        </Link>
      </td>
      <td className="px-6 py-4 flex gap-2">
        <Link href={`/clientes/${cliente.id}/editar`} className="text-primary hover:underline">
          Editar
        </Link>
        <form action={dispatch}>
          <DeleteClientButton />
        </form>
      </td>
    </tr>
  );
}

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
    <div className="w-full bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Buscar por nombre, email o celular..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </form>
      </div>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-background">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold text-primary">
                <Link href={createSortURL('nombre')}>Nombre</Link>
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-primary">
                <Link href={createSortURL('email')}>Email</Link>
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-primary">
                <Link href={createSortURL('celular')}>Celular</Link>
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-primary">Proyecto Asociado</th>
              <th scope="col" className="px-6 py-4 font-semibold text-primary">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length > 0 ? (
              clientes.map((cliente) => (
                <ClienteTableRow key={cliente.id} cliente={cliente} deleteClient={deleteClient} />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-10 text-secondary">
                  No hay clientes para mostrar. ¡Añade uno nuevo!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination count={count} page={page} perPage={perPage} />
    </div>
  );
}