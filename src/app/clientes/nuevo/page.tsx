import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

// Server Action to create a client
async function createClient(formData: FormData) {
  'use server';

  const nombre = formData.get('nombre') as string;
  const id_proyecto = Number(formData.get('id_proyecto'));

  if (!nombre || nombre.trim() === '' || !id_proyecto) {
    throw new Error('Nombre y Proyecto son requeridos.');
  }

  const fechaStr = formData.get('fecha_inicio_desarrollo') as string;

  await prisma.cliente.create({
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
  redirect('/clientes'); // Redirect after creation
}

// The page component
export default async function NuevoClientePage({ searchParams }: { searchParams: { id_proyecto?: string } }) {
  const proyectos = await prisma.proyecto.findMany({ orderBy: { titulo: 'asc' } });
  const preselectedProjectId = searchParams.id_proyecto;

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Añadir Nuevo Cliente</h1>
            <Link href="/clientes" className="text-sm font-medium text-blue-600 hover:underline">
                &larr; Volver a la lista
            </Link>
        </div>
        
        <form action={createClient} className="bg-white p-8 rounded-lg shadow-md flex flex-col gap-6">
          
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-800 mb-1">Nombre <span className="text-red-500">*</span></label>
            <input type="text" name="nombre" id="nombre" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label htmlFor="id_proyecto" className="block text-sm font-medium text-gray-800 mb-1">Proyecto Asociado <span className="text-red-500">*</span></label>
            <select 
              name="id_proyecto" 
              id="id_proyecto" 
              required 
              defaultValue={preselectedProjectId}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar proyecto...</option>
              {proyectos.map(p => <option key={p.id} value={p.id}>{p.titulo}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">Email</label>
            <input type="email" name="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label htmlFor="celular" className="block text-sm font-medium text-gray-800 mb-1">Celular</label>
            <input type="text" name="celular" id="celular" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label htmlFor="fecha_inicio_desarrollo" className="block text-sm font-medium text-gray-800 mb-1">Fecha Inicio de Desarrollo</label>
            <input type="date" name="fecha_inicio_desarrollo" id="fecha_inicio_desarrollo" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label htmlFor="observacion" className="block text-sm font-medium text-gray-800 mb-1">Observación</label>
            <textarea name="observacion" id="observacion" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <div className="flex items-center">
              <input type="checkbox" name="activo" id="activo" defaultChecked className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label htmlFor="activo" className="ml-2 block text-sm font-medium text-gray-900">Cliente Activo</label>
          </div>

          <div className="flex justify-end items-center gap-4 mt-4">
            <Link href="/clientes" className="text-gray-600 hover:underline text-sm">
              Cancelar
            </Link>
            <button type="submit" className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75">
              Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}