import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { handlePrismaError } from './error-handlers';

interface CrudOptions {
  revalidatePaths?: string[];
  redirectPath?: string;
  errorMessage?: string;
}

export async function createRecord<T>(prismaModel: any, data: T, options?: CrudOptions) {
  try {
    const record = await prismaModel.create({ data });
    options?.revalidatePaths?.forEach(path => revalidatePath(path));
    if (options?.redirectPath) {
      redirect(options.redirectPath);
    }
    return { message: 'Registro creado correctamente.', error: false, record };
  } catch (error) {
    return handlePrismaError(error, options?.errorMessage || 'Error al crear el registro.');
  }
}

export async function updateRecord<T>(prismaModel: any, id: number, data: T, options?: CrudOptions) {
  try {
    const record = await prismaModel.update({ where: { id }, data });
    options?.revalidatePaths?.forEach(path => revalidatePath(path));
    if (options?.redirectPath) {
      redirect(options.redirectPath);
    }
    return { message: 'Registro actualizado correctamente.', error: false, record };
  } catch (error) {
    return handlePrismaError(error, options?.errorMessage || 'Error al actualizar el registro.');
  }
}

export async function deleteRecord(prismaModel: any, id: number, options?: CrudOptions) {
  try {
    await prismaModel.delete({ where: { id } });
    options?.revalidatePaths?.forEach(path => revalidatePath(path));
    return { message: 'Registro eliminado correctamente.', error: false };
  } catch (error) {
    return handlePrismaError(error, options?.errorMessage || 'Error al eliminar el registro.');
  }
}
