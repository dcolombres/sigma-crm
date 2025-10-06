'use client';

import Link from 'next/link';
import { Proyecto, Categoria, Dependencia, Cliente } from '@prisma/client';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Pagination from './Pagination';

interface ProyectosTableProps {
  proyectos: (Proyecto & { categoria: Categoria | null; dependenciaActual: Dependencia | null; clientes: Cliente[] })[];
  count: number;
  page: number;
  perPage: number;
  sort: string;
  order: string;
  search: string;
}

export default function ProyectosTable({ proyectos, count, page, perPage, sort, order, search }: ProyectosTableProps) {
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
            placeholder="Buscar por título o descripción..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </form>
      </div>
      <div className="overflow-x-auto rounded-b-lg">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-background">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold text-primary">
                <Link href={createSortURL('titulo')}>Título</Link>
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-primary">Cliente</th>
              <th scope="col" className="px-6 py-4 font-semibold text-primary">
                <Link href={createSortURL('categoria')}>Categoría</Link>
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-primary">
                <Link href={createSortURL('dependenciaActual')}>Dependencia</Link>
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-primary">
                <Link href={createSortURL('activo')}>Estado</Link>
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-primary">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proyectos.length > 0 ? (
              proyectos.map((proyecto) => (
                <tr key={proyecto.id} className="border-b hover:bg-background">
                  <td className="px-6 py-4 font-medium text-primary">
                    <Link href={`/proyectos/${proyecto.id}`} className="hover:underline">
                      {proyecto.titulo}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-secondary">{proyecto.clientes?.[0]?.nombre ?? 'N/A'}</td>
                  <td className="px-6 py-4 text-secondary">{proyecto.categoria?.nombre ?? 'N/A'}</td>
                  <td className="px-6 py-4 text-secondary">{proyecto.dependenciaActual?.nombre ?? 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      proyecto.activo ? 'bg-tag-green/20 text-tag-green' : 'bg-tag-red/20 text-tag-red'
                    }`}>
                      {proyecto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/proyectos/${proyecto.id}/editar`} className="text-primary hover:underline font-medium">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-secondary">
                  No hay proyectos para mostrar.
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
