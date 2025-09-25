import prisma from '@/lib/prisma';
import Link from 'next/link';
import { DeleteButton } from '@/components/DeleteButton';
import { revalidatePath } from 'next/cache';

// Server Action to delete an integration
async function deleteIntegration(id_integracion: number) {
  'use server';
  await prisma.integracion.delete({ where: { id: id_integracion } });
  revalidatePath('/integraciones');
}

export default async function IntegracionesPage() {
  const integraciones = await prisma.integracion.findMany({
    include: {
      responsable: true, // Include the responsible staff member
    },
    orderBy: {
      nombre: 'asc',
    },
  });

  return (
    <main className="flex flex-col items-center w-full min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Integraciones</h1>
          <Link href="/integraciones/nuevo" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
            + Añadir Integración
          </Link>
        </div>

        <div className="w-full bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Nombre</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Función Principal</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Responsable</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {integraciones.length > 0 ? (
                  integraciones.map((integracion) => (
                    <tr key={integracion.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{integracion.nombre}</td>
                      <td className="px-6 py-4 text-gray-600">{integracion.funcion_principal}</td>
                      <td className="px-6 py-4 text-gray-600">{integracion.responsable?.nombre_completo ?? 'N/A'}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <Link href={`/integraciones/${integracion.id}/editar`} className="text-blue-600 hover:underline">
                          Editar
                        </Link>
                        <form action={deleteIntegration.bind(null, integracion.id)}>
                          <DeleteButton className="text-red-600 hover:underline">
                            Eliminar
                          </DeleteButton>
                        </form>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500">
                      No hay integraciones para mostrar. ¡Añade una nueva!
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
