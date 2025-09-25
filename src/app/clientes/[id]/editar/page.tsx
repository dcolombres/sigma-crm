import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

interface EditPageProps {
  params: { id: string };
}

// Server Action to update a client
async function updateClient(id_cliente: number, formData: FormData) {
  'use server';

  const nombre = formData.get('nombre') as string;
  const id_proyecto = Number(formData.get('id_proyecto'));

  if (!nombre || nombre.trim() === '' || !id_proyecto) {
    throw new Error('Nombre y Proyecto son requeridos.');
  }

  const fechaStr = formData.get('fecha_inicio_desarrollo') as string;

  await prisma.cliente.update({
    where: { id: id_cliente },
    data: {
      nombre: nombre,
      id_proyecto: id_proyecto,
      email: formData.get('email') as string,
      celular: formData.get('celular') as string,
      observacion: formData.get('observacion') as string,
      activo: formData.get('activo') === 'on',
      fecha_inicio_desarrollo: fechaStr ? new Date(fechaStr) : null,
    },
  });

  revalidatePath('/clientes'); // Refresh the clients list page
  revalidatePath(`/proyectos/${id_proyecto}`); // Refresh the project detail page
  revalidatePath(`/clientes/${id_cliente}/editar`); // Refresh the current page
  redirect('/clientes'); // Redirect to client list after update
}

// The page component
export default async function EditarClientePage({ params }: EditPageProps) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const [client, proyectos] = await Promise.all([
    prisma.cliente.findUnique({ where: { id } }),
    prisma.proyecto.findMany({ orderBy: { titulo: 'asc' } }),
  ]);

  if (!client) return notFound();

  const updateClientWithId = updateClient.bind(null, client.id);

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Editar Cliente: {client.nombre}</h1>
            <Link href="/clientes" className="text-sm font-medium text-blue-600 hover:underline">
                &larr; Volver a la lista
            </Link>
        </div>
        
        <form action={updateClientWithId} className="bg-white p-8 rounded-lg shadow-md flex flex-col gap-6">
          
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-800 mb-1">Nombre <span className="text-red-500">*</span></label>
            <input type="text" name="nombre" id="nombre" required defaultValue={client.nombre} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label htmlFor="id_proyecto" className="block text-sm font-medium text-gray-800 mb-1">Proyecto Asociado <span className="text-red-500">*</span></label>
            <select 
              name="id_proyecto" 
              id="id_proyecto" 
              required 
              defaultValue={client.id_proyecto}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar proyecto...</option>
              {proyectos.map(p => <option key={p.id} value={p.id}>{p.titulo}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">Email</label>
            <input type="email" name="email" id="email" defaultValue={client.email || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label htmlFor="celular" className="block text-sm font-medium text-gray-800 mb-1">Celular</label>
            <input type="text" name="celular" id="celular" defaultValue={client.celular || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label htmlFor="fecha_inicio_desarrollo" className="block text-sm font-medium text-gray-800 mb-1">Fecha Inicio de Desarrollo</label>
            <input type="date" name="fecha_inicio_desarrollo" id="fecha_inicio_desarrollo" defaultValue={client.fecha_inicio_desarrollo?.toISOString().split('T')[0] || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label htmlFor="observacion" className="block text-sm font-medium text-gray-800 mb-1">Observación</label>
            <textarea name="observacion" id="observacion" rows={3} defaultValue={client.observacion || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <div className="flex items-center">
              <input type="checkbox" name="activo" id="activo" defaultChecked={client.activo || false} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label htmlFor="activo" className="ml-2 block text-sm font-medium text-gray-900">Cliente Activo</label>
          </div>

          <div className="flex justify-end items-center gap-4 mt-4">
            <Link href="/clientes" className="text-gray-600 hover:underline text-sm">
              Cancelar
            </Link>
            <button type="submit" className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
