import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const [proyectos, staff, clientes] = await Promise.all([
      prisma.proyecto.findMany({
        where: {
          OR: [
            { nombre: { contains: query, mode: 'insensitive' } },
            { descripcion: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, nombre: true },
        take: 5,
      }),
      prisma.staff.findMany({
        where: {
          OR: [
            { nombres: { contains: query, mode: 'insensitive' } },
            { apellidos: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, nombres: true, apellidos: true },
        take: 5,
      }),
      prisma.cliente.findMany({
        where: {
          OR: [
            { nombre: { contains: query } },
            { email: { contains: query } },
          ],
        },
        select: { id: true, nombre: true },
        take: 5,
      }),
    ]);

    const results = {
      proyectos: proyectos.map(p => ({ ...p, type: 'proyectos' })),
      staff: staff.map(s => ({ ...s, type: 'staff' })),
      clientes: clientes.map(c => ({ ...c, type: 'clientes' })),
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('Global search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
