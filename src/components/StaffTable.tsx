'use client';

import Link from 'next/link';
import { Staff } from '@prisma/client';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import toast from 'react-hot-toast';
import Pagination from './Pagination';

interface StaffTableProps {
  staff: Staff[];
  count: number;
  page: number;
  perPage: number;
  sort: string;
  order: string;
  search: string;
  deleteStaff: (id: number, prevState: { message: string; error: boolean; }, formData: FormData) => Promise<{ message: string; error: boolean; }>;
}

function DeleteStaffButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="text-tag-red hover:underline disabled:text-tag-red/50">
      {pending ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}

function StaffTableRow({ person, deleteStaff }: { person: Staff, deleteStaff: StaffTableProps['deleteStaff'] }) {
  const initialState = { message: "", error: false };
  const [state, dispatch] = useFormState(deleteStaff.bind(null, person.id), initialState);

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
        <Link href={`/staff/${person.id}/editar`} className="hover:underline">
          {person.nombre_completo}
        </Link>
      </td>
      <td className="px-6 py-4 text-secondary">{person.email}</td>
      <td className="px-6 py-4 text-secondary">{person.rol_staff ?? 'N/A'}</td>
      <td className="px-6 py-4 flex gap-2">
        <Link href={`/staff/${person.id}/editar`} className="text-primary hover:underline">
          Editar
        </Link>
        <form action={dispatch}>
          <DeleteStaffButton />
        </form>
      </td>
    </tr>
  );
}

export default function StaffTable({ staff, count, page, perPage, sort, order, search, deleteStaff }: StaffTableProps) {
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
            placeholder="Buscar por nombre, email o rol..."
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
                <Link href={createSortURL('nombre_completo')}>Nombre Completo</Link>
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-primary">
                <Link href={createSortURL('email')}>Email</Link>
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-primary">
                <Link href={createSortURL('rol_staff')}>Rol</Link>
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-primary">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {staff.length > 0 ? (
              staff.map((person) => (
                <StaffTableRow key={person.id} person={person} deleteStaff={deleteStaff} />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-10 text-secondary">
                  No hay personal para mostrar.
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
