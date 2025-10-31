'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getNumberOrNull, toDateOrNull, calculateAge, toBoolean } from '@/lib/utils';


export async function updateClient(id_cliente: number, prevState: { message: string; error: boolean; }, formData: FormData): Promise<{ message: string; error: boolean; }> {
  'use server';

  const nombre = formData.get('nombre') as string;

  if (!nombre || nombre.trim() === '') {
    return { message: 'Nombre es requerido.', error: true };
  }

  try {
    await prisma.cliente.update({
      where: { id: id_cliente },
      data: {
        nombre: nombre,
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
      return { message: 'Ya existe un cliente con este nombre.', error: true };
    }
    return { message: 'Error al actualizar el cliente.', error: true };
  }

  revalidatePath('/clientes');
  revalidatePath(`/clientes/${id_cliente}/editar`);
  redirect('/clientes');
}

export async function createClient(prevState: { message: string; error: boolean; }, formData: FormData): Promise<{ message: string; error: boolean; }> {
  'use server';

  const nombre = formData.get('nombre') as string;

  if (!nombre || nombre.trim() === '') {
    return { message: 'Nombre es requerido.', error: true };
  }

  try {
    await prisma.cliente.create({
      data: {
        nombre: nombre,
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
      return { message: 'Ya existe un cliente con este nombre.', error: true };
    }
    return { message: 'Error al crear el cliente.', error: true };
  }

  revalidatePath('/clientes');
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

export async function createProject(prevState: { message: string; error: boolean; }, formData: FormData): Promise<{ message: string; error: boolean; }> {
  'use server';

  const nombre = formData.get('nombre') as string;

  if (!nombre || nombre.trim() === '') {
    return { message: 'Nombre es requerido.', error: true };
  }

  try {
    await prisma.proyecto.create({
      data: {
        nombre: nombre,
        codigo_trazabilidad: formData.get('codigo_trazabilidad') as string,
        descripcion: formData.get('descripcion') as string,
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { message: 'Ya existe un proyecto con este nombre.', error: true };
    }
    return { message: 'Error al crear el proyecto.', error: true };
  }

  revalidatePath('/proyectos');
  redirect('/proyectos');
}

export async function updateProject(id_proyecto: number, prevState: { message: string; error: boolean; }, formData: FormData): Promise<{ message: string; error: boolean; }> {
  'use server';

  const data: Prisma.ProyectoUpdateInput = {};

  if (formData.has('nombre')) {
    const nombre = formData.get('nombre') as string;
    if (!nombre || nombre.trim() === '') {
      return { message: 'Nombre es requerido.', error: true };
    }
    data.nombre = nombre;
  }

  if (formData.has('codigo_trazabilidad')) {
    data.codigo_trazabilidad = formData.get('codigo_trazabilidad') as string;
  }
  if (formData.has('descripcion')) {
    data.descripcion = formData.get('descripcion') as string;
  }
  if (formData.has('origen')) {
    data.origen = formData.get('origen') as string;
  }
  if (formData.has('dependencia')) {
    data.dependencia = formData.get('dependencia') as string;
  }
  if (formData.has('tier')) {
    data.tier = formData.get('tier') as string;
  }
  if (formData.has('stack')) {
    data.stack = formData.get('stack') as string;
  }
  if (formData.has('status_salud')) {
    data.status_salud = formData.get('status_salud') as string;
  }
  if (formData.has('status_pmo')) {
    data.status_pmo = formData.get('status_pmo') as string;
  }
  if (formData.has('categoria')) {
    data.categoria = formData.get('categoria') as string;
  }
  if (formData.has('subcategoria')) {
    data.subcategoria = formData.get('subcategoria') as string;
  }
  if (formData.has('observacion')) {
    data.observacion = formData.get('observacion') as string;
  }
  if (formData.has('captura_url')) {
    data.captura_url = formData.get('captura_url') as string;
  }
  if (formData.has('nube')) {
    data.nube = formData.get('nube') as string;
  }
  if (formData.has('ticketera_interna')) {
    data.ticketera_interna = formData.get('ticketera_interna') as string;
  }
  if (formData.has('ticketera_externa')) {
    data.ticketera_externa = formData.get('ticketera_externa') as string;
  }
  if (formData.has('url_changelog')) {
    data.url_changelog = formData.get('url_changelog') as string;
  }
  if (formData.has('anio_inicio_sistema')) {
    data.anio_inicio_sistema = getNumberOrNull(formData.get('anio_inicio_sistema'));
  }
  if (formData.has('usuarios_internos')) {
    data.usuarios_internos = getNumberOrNull(formData.get('usuarios_internos'));
  }
  if (formData.has('usuarios_externos')) {
    data.usuarios_externos = getNumberOrNull(formData.get('usuarios_externos'));
  }
  if (formData.has('id_plataforma')) {
    data.id_plataforma = getNumberOrNull(formData.get('id_plataforma'));
  }
  if (formData.has('id_tipo_desarrollo')) {
    data.id_tipo_desarrollo = getNumberOrNull(formData.get('id_tipo_desarrollo'));
  }
  if (formData.has('id_control_versiones')) {
    data.id_control_versiones = getNumberOrNull(formData.get('id_control_versiones'));
  }
  if (formData.has('url_control_versiones')) {
    data.url_control_versiones = formData.get('url_control_versiones') as string;
  }
  if (formData.has('id_tipo_sistema')) {
    data.id_tipo_sistema = getNumberOrNull(formData.get('id_tipo_sistema'));
  }
  if (formData.has('id_alojamiento_infra')) {
    data.id_alojamiento_infra = getNumberOrNull(formData.get('id_alojamiento_infra'));
  }
  if (formData.has('url_sistema_desarrollo')) {
    data.url_sistema_desarrollo = formData.get('url_sistema_desarrollo') as string;
  }
  if (formData.has('url_repositorio')) {
    data.url_repositorio = formData.get('url_repositorio') as string;
  }
  if (formData.has('url_sistema')) {
    data.url_sistema = formData.get('url_sistema') as string;
  }
  if (formData.has('id_alojamiento_infra_db')) {
    data.id_alojamiento_infra_db = getNumberOrNull(formData.get('id_alojamiento_infra_db'));
  }

  if (formData.has('idCliente')) {
    const idCliente = getNumberOrNull(formData.get('idCliente'));
    if (idCliente) {
      data.cliente = {
        connect: { id: idCliente }
      };
    } else {
      data.cliente = {
        disconnect: true
      };
    }
  }

  if (formData.has('id_responsable')) {
    const idResponsable = getNumberOrNull(formData.get('id_responsable'));
    if (idResponsable) {
      data.responsable = {
        connect: { id: idResponsable }
      };
    } else {
      data.responsable = {
        disconnect: true
      };
    }
  }

  if (formData.has('equipo')) {
    const equipoIds = formData.getAll('equipo').map(id => Number(id as string));
    data.staff = {
      set: equipoIds.map(id => ({ id }))
    };
  }

  try {
    await prisma.proyecto.update({
      where: { id: id_proyecto },
      data,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { message: 'Ya existe un proyecto con este nombre.', error: true };
    }
    return { message: 'Error al actualizar el proyecto.', error: true };
  }

  revalidatePath('/proyectos');
  revalidatePath(`/proyectos/${id_proyecto}/editar`);
  revalidatePath(`/proyectos/${id_proyecto}/tecnologia`);
  revalidatePath(`/proyectos/${id_proyecto}/backend`);
  revalidatePath(`/proyectos/${id_proyecto}/frontend`);
  revalidatePath(`/proyectos/${id_proyecto}/database`);
  redirect('/proyectos');
}