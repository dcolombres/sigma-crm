import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

// Server Action to create an integration
async function createIntegration(formData: FormData) {
  'use server';

  const nombre = formData.get('nombre') as string;
  const id_responsable = Number(formData.get('id_responsable'));

  if (!nombre || nombre.trim() === '') {
    throw new Error('El nombre de la integración es requerido.');
  }

  await prisma.integracion.create({
    data: {
      nombre: nombre,
      funcion_principal: formData.get('funcion_principal') as string,
      documentacion: formData.get('documentacion') as string,
      id_responsable: id_responsable || null, // Allow null if no responsible selected
    },
  });

  revalidatePath('/integraciones'); // Refresh the integrations list page
  redirect('/integraciones'); // Redirect after creation
}

// The page component
export default async function NuevoIntegracionPage() {
  const staff = await prisma.staff.findMany({ orderBy: { nombre_completo: 'asc' } });

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Añadir Nueva Integración</h1>
            <Link href="/integraciones" className="text-sm font-medium text-blue-600 hover:underline">
                &larr; Volver a la lista
            </Link>
        </div>
        
        <form action={createIntegration} className="bg-white p-8 rounded-lg shadow-md flex flex-col gap-6">
          
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-800 mb-1">Nombre Integración <span className="text-red-500">*</span></label>
            <input type="text" name="nombre" id="nombre" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label htmlFor="funcion_principal" className="block text-sm font-medium text-gray-800 mb-1">Función Principal</label>
            <textarea name="funcion_principal" id="funcion_principal" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <div>
            <label htmlFor="documentacion" className="block text-sm font-medium text-gray-800 mb-1">Documentación (Markdown)</label>
            <textarea name="documentacion" id="documentacion" rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <div>
            <label htmlFor="id_responsable" className="block text-sm font-medium text-gray-800 mb-1">Responsable</label>
            <select name="id_responsable" id="id_responsable" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="">Seleccionar responsable...</option>
              {staff.map(s => <option key={s.id} value={s.id}>{s.nombre_completo}</option>)}
            </select>
          </div>

          <div className="flex justify-end items-center gap-4 mt-4">
            <Link href="/integraciones" className="text-gray-600 hover:underline text-sm">
              Cancelar
            </Link>
            <button type="submit" className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75">
              Guardar Integración
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
