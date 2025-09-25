import prisma from '@/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { DeleteButton } from '@/components/DeleteButton';

// --- SERVER ACTIONS ---
async function deleteClient(id_cliente: number) {
  'use server';
  await prisma.cliente.delete({ where: { id: id_cliente } });
  revalidatePath('/clientes');
  // No redirect needed as we are on the list page
}

export default async function ClientesPage() {
  const clientes = await prisma.cliente.findMany({
    include: {
      proyecto: true, // Include the related project
    },
    orderBy: {
      nombre: 'asc',
    },
  });

  return (
    <main className="flex flex-col items-center w-full min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
          <Link href="/clientes/nuevo" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
            + Añadir Cliente
          </Link>
        </div>

        <div className="w-full bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Nombre</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Email</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Celular</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Proyecto Asociado</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length > 0 ? (
                  clientes.map((cliente) => (
                    <tr key={cliente.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{cliente.nombre}</td>
                      <td className="px-6 py-4 text-gray-600">{cliente.email}</td>
                      <td className="px-6 py-4 text-gray-600">{cliente.celular}</td>
                      <td className="px-6 py-4 text-gray-600">
                        <Link href={`/proyectos/${cliente.proyecto.id}`} className="text-blue-600 hover:underline">
                          {cliente.proyecto.titulo}
                        </Link>
                      </td>
                      <td className="px-6 py-4 flex gap-2"> {/* Added flex gap for buttons */}
                        <Link href={`/clientes/${cliente.id}/editar`} className="text-blue-600 hover:underline">
                          Editar
                        </Link>
                        <form action={deleteClient.bind(null, cliente.id)}>
                          <DeleteButton className="text-red-600 hover:underline">
                            Eliminar
                          </DeleteButton>
                        </form>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      No hay clientes para mostrar. ¡Añade uno nuevo!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}