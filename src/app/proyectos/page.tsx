import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function ProyectosPage() {
  const proyectos = await prisma.proyecto.findMany({
    include: {
      categoria: true,
      dependenciaActual: true,
    },
    orderBy: {
      id: 'desc',
    },
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Proyectos</h1>
        <Link href="/proyectos/nuevo" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
            + Crear Proyecto
        </Link>
      </div>

      <div className="w-full bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Título</th>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Categoría</th>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Dependencia</th>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Estado</th>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.length > 0 ? (
                proyectos.map((proyecto) => (
                  <tr key={proyecto.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{proyecto.titulo}</td>
                    <td className="px-6 py-4 text-gray-600">{proyecto.categoria?.nombre ?? 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-600">{proyecto.dependenciaActual?.nombre ?? 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        proyecto.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {proyecto.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/proyectos/${proyecto.id}`} className="text-blue-600 hover:underline">
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    No hay proyectos para mostrar. ¡Crea uno nuevo!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
