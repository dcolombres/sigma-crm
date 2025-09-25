import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

interface EditPageProps {
  params: { id: string };
}

// Server Action to update a staff member
async function updateStaff(id_staff: number, formData: FormData) {
  'use server';

  const nombre = formData.get('nombre_completo') as string;
  const email = formData.get('email') as string;

  if (!nombre || nombre.trim() === '' || !email || email.trim() === '') {
    throw new Error('Nombre y Email son requeridos.');
  }

  await prisma.staff.update({
    where: { id: id_staff },
    data: {
      nombre_completo: nombre,
      email: email,
      rol: formData.get('rol') as string,
    },
  });

  revalidatePath('/staff'); // Refresh the staff list page
  revalidatePath(`/staff/${id_staff}/editar`); // Refresh the current page
  redirect('/staff'); // Redirect to staff list after update
}

// The page component
export default async function EditarStaffPage({ params }: EditPageProps) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const staffMember = await prisma.staff.findUnique({ where: { id } });

  if (!staffMember) return notFound();

  const updateStaffWithId = updateStaff.bind(null, staffMember.id);

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Editar Staff: {staffMember.nombre_completo}</h1>
            <Link href="/staff" className="text-sm font-medium text-blue-600 hover:underline">
                &larr; Volver a la lista
            </Link>
        </div>
        
        <form action={updateStaffWithId} className="bg-white p-8 rounded-lg shadow-md flex flex-col gap-6">
          
          <div>
            <label htmlFor="nombre_completo" className="block text-sm font-medium text-gray-800 mb-1">Nombre Completo <span className="text-red-500">*</span></label>
            <input type="text" name="nombre_completo" id="nombre_completo" required defaultValue={staffMember.nombre_completo} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">Email <span className="text-red-500">*</span></label>
            <input type="email" name="email" id="email" required defaultValue={staffMember.email} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label htmlFor="rol" className="block text-sm font-medium text-gray-800 mb-1">Rol</label>
            <input type="text" name="rol" id="rol" defaultValue={staffMember.rol || ''} placeholder="Ej: Desarrollador, Project Manager" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="flex justify-end items-center gap-4 mt-4">
            <Link href="/staff" className="text-gray-600 hover:underline text-sm">
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
