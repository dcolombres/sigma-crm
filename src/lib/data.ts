import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export async function getClients(page: number, perPage: number, search: string) {
  const where: Prisma.ClienteWhereInput = search
    ? {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { celular: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const clients = await prisma.cliente.findMany({
    where,
    include: {
      proyecto: true,
    },
    skip: (page - 1) * perPage,
    take: perPage,
  });

  return clients;
}

export async function getClientsCount(search: string) {
  const where: Prisma.ClienteWhereInput = search
    ? {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { celular: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const count = await prisma.cliente.count({ where });

  return count;
}
