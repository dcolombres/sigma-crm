'use client';

import Link from 'next/link';
import { Cliente, Proyecto } from '@prisma/client';
import Pagination from './Pagination';
import ResponsiveTable from './ResponsiveTable';
import { PencilIcon } from '@heroicons/react/24/outline';

interface ClientesTableProps {
  clients: (Cliente & { proyectos: Proyecto[] })[];
  currentPage: number;
  totalPages: number;
}

function ClienteTableRow({ cliente }: { cliente: ClientesTableProps['clients'][0] }) {
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
        {cliente.proyectos && cliente.proyectos.length > 0 ? (
          <Link href={`/proyectos/${cliente.proyectos[0].id}`} className="no-underline">
            {cliente.proyectos[0].nombre}
          </Link>
        ) : (
          'N/A'
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
        <Link href={`/clientes/${cliente.id}/editar`} className="text-primary hover:text-primary-dark no-underline p-2">
          <PencilIcon className="h-5 w-5" />
        </Link>
      </td>
    </tr>
  );
}

export default function ClientesTable({ clients, currentPage, totalPages }: ClientesTableProps) {
  return (
    <div>
      <ResponsiveTable>
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Celular
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
          {clients.length > 0 ? (
            clients.map((cliente) => (
              <ClienteTableRow key={cliente.id} cliente={cliente} />
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
      <Pagination page={currentPage} totalPages={totalPages} />
    </div>
  );
}
