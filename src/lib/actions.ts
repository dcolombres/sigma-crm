'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getNumberOrNull, toDateOrNull, calculateAge, toBoolean } from '@/lib/utils';


export async function updateClient(id_cliente: number, prevState: { message: string; error: boolean; }, formData: FormData): Promise<{ message: string; error: boolean; }> {
  'use server';

  const nombre = formData.get('nombre') as string;
  const id_proyecto = getNumberOrNull(formData.get('id_proyecto'));

  if (!nombre || nombre.trim() === '' || !id_proyecto) {
    return { message: 'Nombre y Proyecto son requeridos.', error: true };
  }

  try {
    await prisma.cliente.update({
      where: { id: id_cliente },
      data: {
        nombre: nombre,
        id_proyecto: id_proyecto,
        email: formData.get('email') as string,
        celular: formData.get('celular') as string,
        observacion: formData.get('observacion') as string,
        activo: toBoolean(formData.get('activo')),
        fecha_inicio_desarrollo: toDateOrNull(formData.get('fecha_inicio_desarrollo')),
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { message: 'Ya existe un cliente con este nombre para este proyecto.', error: true };
    }
    return { message: 'Error al actualizar el cliente.', error: true };
  }

  revalidatePath('/clientes');
  revalidatePath(`/proyectos/${id_proyecto}`);
  revalidatePath(`/clientes/${id_cliente}/editar`);
  redirect('/clientes');
}

export async function createClient(prevState: { message: string; error: boolean; }, formData: FormData): Promise<{ message: string; error: boolean; }> {
  'use server';

  const nombre = formData.get('nombre') as string;
  const id_proyecto = getNumberOrNull(formData.get('id_proyecto'));

  if (!nombre || nombre.trim() === '' || !id_proyecto) {
    return { message: 'Nombre y Proyecto son requeridos.', error: true };
  }

  try {
    await prisma.cliente.create({
      data: {
        nombre: nombre,
        id_proyecto: id_proyecto,
        email: formData.get('email') as string,
        celular: formData.get('celular') as string,
        observacion: formData.get('observacion') as string,
        activo: toBoolean(formData.get('activo')),
        fecha_inicio_desarrollo: toDateOrNull(formData.get('fecha_inicio_desarrollo')),
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { message: 'Ya existe un cliente con este nombre para este proyecto.', error: true };
    }
    return { message: 'Error al crear el cliente.', error: true };
  }

  revalidatePath('/clientes');
  revalidatePath(`/proyectos/${id_proyecto}`);
  redirect('/clientes');
}

export async function deleteClient(id_cliente: number, prevState: { message: string; error: boolean; }, formData: FormData): Promise<{ message: string; error: boolean; }> {
  try {
    await prisma.cliente.delete({ where: { id: id_cliente } });
    revalidatePath('/clientes');
    return { message: 'Cliente eliminado correctamente.', error: false };
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        return { message: `No se puede eliminar el cliente porque tiene registros relacionados.`, error: true };
    }
    return { message: 'Error al eliminar el cliente.', error: true };
  }
}

export async function updateStaff(id_staff: number, prevState: { message: string; error: boolean; }, formData: FormData): Promise<{ message: string; error: boolean; }> {
  'use server';

  const nombres = formData.get('nombres') as string;
  const apellidos = formData.get('apellidos') as string;
  const email = formData.get('email') as string;

  if (!nombres || !apellidos || !email) {
    return { message: 'Nombres, Apellidos y Email son requeridos.', error: true };
  }

  try {
    const cumpleanos = toDateOrNull(formData.get('cumpleanos'));
    const proyectoIds = formData.getAll('proyectos').map(id => Number(id as string));

    await prisma.staff.update({
      where: { id: id_staff },
      data: {
        email,
        nombres,
        apellidos,
        cumpleanos: cumpleanos?.toISOString(),
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
          set: proyectoIds.map(id => ({ id })),
        },
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { message: 'El email ya existe.', error: true };
    }
    return { message: 'Error al actualizar la persona.', error: true };
  }

  revalidatePath('/staff');
  revalidatePath(`/staff/${id_staff}/editar`);
  redirect('/staff');
}

export async function createStaff(prevState: { message: string; error: boolean; }, formData: FormData): Promise<{ message: string; error: boolean; }> {
  'use server';

  const nombres = formData.get('nombres') as string;
  const apellidos = formData.get('apellidos') as string;
  const email = formData.get('email') as string;

  if (!nombres || !apellidos || !email) {
    return { message: 'Nombres, Apellidos y Email son requeridos.', error: true };
  }

  try {
    await prisma.staff.create({
      data: {
        nombres,
        apellidos,
        email: email,
        rol_staff: formData.get('rol_staff') as string,
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { message: 'El email ya existe.', error: true };
    }
    return { message: 'Error al crear la persona.', error: true };
  }

  revalidatePath('/staff');
  redirect('/staff');
}

export async function deleteStaff(id_staff: number, prevState: { message: string; error: boolean; }, formData: FormData): Promise<{ message: string; error: boolean; }> {
  try {
    await prisma.staff.delete({ where: { id: id_staff } });
    revalidatePath('/staff');
    return { message: 'Persona eliminada correctamente.', error: false };
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        return { message: `No se puede eliminar la persona porque tiene registros relacionados (proyectos, etc.).`, error: true };
    }
    return { message: 'Error al eliminar la persona.', error: true };
  }
}

export async function deleteProject(id_proyecto: number, prevState: { message: string; error: boolean; }, formData: FormData): Promise<{ message: string; error: boolean; }> {
  try {
    await prisma.proyecto.delete({ where: { id: id_proyecto } });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        return { message: `No se puede eliminar el proyecto porque tiene registros relacionados (staff, clientes, etc.).`, error: true };
    }
    return { message: 'Error al eliminar el proyecto.', error: true };
  }
  revalidatePath('/');
  redirect('/');
}