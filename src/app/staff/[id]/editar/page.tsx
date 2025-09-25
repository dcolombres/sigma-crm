import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

// --- SERVER ACTION ---
async function updateStaff(id_staff: number, formData: FormData) {
  'use server';

  const email = formData.get('email') as string;
  const nombres = formData.get('nombres') as string;
  const apellidos = formData.get('apellidos') as string;

  if (!nombres || !apellidos || !email) {
    throw new Error('Nombres, Apellidos y Email son requeridos.');
  }

  try {
    const nombre_completo = `${nombres} ${apellidos}`;
    const toBoolean = (value: FormDataEntryValue | null) => value === 'on';
    const toDateOrNull = (value: FormDataEntryValue | null) => {
        const str = value as string;
        if (!str) return null;
        const [year, month, day] = str.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    }

    const cumpleanos = toDateOrNull(formData.get('cumpleanos'));
    let edad: number | null = null;
    if (cumpleanos) {
      const today = new Date();
      const birthDate = new Date(cumpleanos);
      edad = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        edad--;
      }
    }

    const proyectoIds = formData.getAll('proyectos').map(id => Number(id as string));

    await prisma.staff.update({
      where: { id: id_staff },
      data: {
        nombre_completo,
        email,
        nombres,
        apellidos,
        edad,
        cumpleanos,
        rol_staff: formData.get('rol_staff') as string,
        contrato: formData.get('contrato') as string,
        activo: toBoolean(formData.get('activo')),
        comentario: formData.get('comentario') as string,
        modalidad: formData.get('modalidad') as string,
        experiencia: formData.get('experiencia') as string,
        origen: formData.get('origen') as string,
        skills: formData.get('skills') as string,
        desempeno_ley_dto: formData.get('desempeno_ley_dto') as string,
        hhee: toBoolean(formData.get('hhee')),
        ur: toBoolean(formData.get('ur')),
        coordinacion: formData.get('coordinacion') as string,
        presencialidad: formData.get('presencialidad') as string,
        proyectos: {
          deleteMany: {},
          create: proyectoIds.map(id => ({ proyecto: { connect: { id } }})),
        },
      },
    });

  } catch (error) {
    console.error(error);
    // Optionally, handle error display
  }

  revalidatePath('/staff');
  revalidatePath(`/staff/${id_staff}/editar`);
  redirect('/staff');
}

// --- SERVER COMPONENT (Default Export) ---
export default async function EditarStaffPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const [staffMember, allProyectos] = await Promise.all([
    prisma.staff.findUnique({
      where: { id },
      include: {
        proyectos: { select: { id_proyecto: true } }
      }
    }),
    prisma.proyecto.findMany({ orderBy: { titulo: 'asc' } })
  ]);

  if (!staffMember) return notFound();
  
  const updateStaffWithId = updateStaff.bind(null, staffMember.id);
  const staffProjectIds = new Set(staffMember.proyectos.map(p => p.id_proyecto));

  return (
    <div className="w-full">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Editar Staff: {staffMember.nombre_completo}</h1>
            <Link href="/staff" className="text-sm font-medium text-blue-600 hover:underline">
                &larr; Volver a la lista
            </Link>
        </div>
        
        <form action={updateStaffWithId} className="bg-white p-8 rounded-lg shadow-md border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-1">Nombres <span className="text-red-500">*</span></label>
              <input type="text" name="nombres" id="nombres" required defaultValue={staffMember.nombres || ''} className="w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">Apellidos <span className="text-red-500">*</span></label>
              <input type="text" name="apellidos" id="apellidos" required defaultValue={staffMember.apellidos || ''} className="w-full border-gray-300 rounded-md shadow-sm" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
              <input type="email" name="email" id="email" required defaultValue={staffMember.email} className="w-full border-gray-300 rounded-md shadow-sm" />
            </div>

            <div>
              <label htmlFor="rol_staff" className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <input type="text" name="rol_staff" id="rol_staff" defaultValue={staffMember.rol_staff || ''} className="w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="contrato" className="block text-sm font-medium text-gray-700 mb-1">Contrato</label>
              <input type="text" name="contrato" id="contrato" defaultValue={staffMember.contrato || ''} className="w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="modalidad" className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
              <input type="text" name="modalidad" id="modalidad" defaultValue={staffMember.modalidad || ''} className="w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700 mb-1">Experiencia</label>
              <input type="text" name="experiencia" id="experiencia" defaultValue={staffMember.experiencia || ''} className="w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="origen" className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
              <input type="text" name="origen" id="origen" defaultValue={staffMember.origen || ''} className="w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="desempeno_ley_dto" className="block text-sm font-medium text-gray-700 mb-1">Desempeño Ley DTO</label>
              <input type="text" name="desempeno_ley_dto" id="desempeno_ley_dto" defaultValue={staffMember.desempeno_ley_dto || ''} className="w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="coordinacion" className="block text-sm font-medium text-gray-700 mb-1">Coordinación</label>
              <input type="text" name="coordinacion" id="coordinacion" defaultValue={staffMember.coordinacion || ''} className="w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="presencialidad" className="block text-sm font-medium text-gray-700 mb-1">Presencialidad</label>
              <input type="text" name="presencialidad" id="presencialidad" defaultValue={staffMember.presencialidad || ''} className="w-full border-gray-300 rounded-md shadow-sm" />
            </div>

            <div>
              <label htmlFor="cumpleanos" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
              <input type="date" name="cumpleanos" id="cumpleanos" defaultValue={staffMember.cumpleanos ? new Date(staffMember.cumpleanos).toISOString().split('T')[0] : ''} className="w-full border-gray-300 rounded-md shadow-sm" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
              <textarea name="comentario" id="comentario" rows={3} defaultValue={staffMember.comentario || ''} className="w-full border-gray-300 rounded-md shadow-sm"></textarea>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <textarea name="skills" id="skills" rows={3} defaultValue={staffMember.skills || ''} className="w-full border-gray-300 rounded-md shadow-sm"></textarea>
            </div>

            <div className="md:col-span-2">
                <label htmlFor="proyectos" className="block text-sm font-medium text-gray-700 mb-1">Proyectos Asignados</label>
                <select
                    multiple
                    name="proyectos"
                    id="proyectos"
                    defaultValue={Array.from(staffProjectIds).map(String)}
                    className="w-full h-40 border-gray-300 rounded-md shadow-sm"
                >
                    {allProyectos.map(proyecto => (
                        <option key={proyecto.id} value={proyecto.id}>
                            {proyecto.titulo}
                        </option>
                    ))}
                </select>
            </div>

            <div className="md:col-span-2 grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="activo" id="activo" defaultChecked={staffMember.activo || false} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <label htmlFor="activo" className="text-sm font-medium">Activo</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="hhee" id="hhee" defaultChecked={staffMember.hhee || false} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <label htmlFor="hhee" className="text-sm font-medium">HHEE</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="ur" id="ur" defaultChecked={staffMember.ur || false} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <label htmlFor="ur" className="text-sm font-medium">UR</label>
                </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 mt-8">
            <Link href="/staff" className="text-sm text-gray-600 hover:underline">
              Cancelar
            </Link>
            <button type="submit" className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700">
              Guardar Cambios
            </button>
          </div>
        </form>
    </div>
  );
}