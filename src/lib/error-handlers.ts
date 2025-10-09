import { Prisma } from '@prisma/client';

export function handlePrismaError(error: unknown, defaultMessage: string): { message: string; error: boolean; } {
  console.error(error);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return { message: `Error de base de datos: ${error.meta?.target} ya existe.`, error: true };
      case 'P2003':
        return { message: `No se puede eliminar el registro porque tiene dependencias.`, error: true };
      case 'P2025':
        return { message: `El registro no fue encontrado.`, error: true };
      default:
        return { message: `Error de base de datos: ${error.message}`, error: true };
    }
  }
  return { message: defaultMessage, error: true };
}
