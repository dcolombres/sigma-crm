'use client';

import Link from 'next/link';
import { Integracion, Staff } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import Pagination from './Pagination';

interface IntegracionesTableProps {
  integraciones: (Integracion & { responsable: Staff | null })[];
  count: number;
  page: number;
  perPage: number;
  sort: string;
  order: string;
  search: string;
  deleteIntegration: (id: number, prevState: { message: string; error: boolean; }, formData: FormData) => Promise<{ message: string; error: boolean; }>;
}

function DeleteIntegrationButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="text-tag-red hover:underline disabled:text-tag-red/50">
      {pending ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}

function IntegracionTableRow({ integracion, deleteIntegration }: { integracion: IntegracionesTableProps['integraciones'][0], deleteIntegration: IntegracionesTableProps['deleteIntegration'] }) {
  const initialState = { message: "", error: false };
  const [state, dispatch] = useFormState(deleteIntegration.bind(null, integracion.id), initialState);

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
        <Link href={`/integraciones/${integracion.id}/editar`} className="hover:underline">
          {integracion.nombre}
        </Link>
      </td>
      <td className="px-6 py-4 text-secondary">{integracion.funcion_principal}</td>
      <td className="px-6 py-4 text-secondary">{integracion.responsable?.nombre_completo ?? 'N/A'}</td>
      <td className="px-6 py-4 flex gap-2">
        <Link href={`/integraciones/${integracion.id}/editar`} className="text-primary hover:underline">
          Editar
        </Link>
        <form action={dispatch}>
          <DeleteIntegrationButton />
        </form>
      </td>
    </tr>
  );
}

export default function IntegracionesTable({ integraciones, count, page, perPage, sort, order, search, deleteIntegration }: IntegracionesTableProps) {
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
            placeholder="Buscar por nombre o función..."
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
                <Link href={createSortURL('funcion_principal')}>Función Principal</Link>
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-primary">Responsable</th>
              <th scope="col" className="px-6 py-4 font-semibold text-primary">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {integraciones.length > 0 ? (
              integraciones.map((integracion) => (
                <IntegracionTableRow key={integracion.id} integracion={integracion} deleteIntegration={deleteIntegration} />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-10 text-secondary">
                  No hay integraciones para mostrar. ¡Añade una nueva!
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