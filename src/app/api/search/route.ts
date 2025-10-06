import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const [proyectos, staff, clientes, integraciones] = await Promise.all([
      prisma.proyecto.findMany({
        where: {
          OR: [
            { titulo: { contains: query } },
            { storyline: { contains: query } },
          ],
        },
        select: { id: true, titulo: true },
        take: 5,
      }),
      prisma.staff.findMany({
        where: {
          OR: [
            { nombre_completo: { contains: query } },
            { email: { contains: query } },
          ],
        },
        select: { id: true, nombre_completo: true },
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
      prisma.integracion.findMany({
        where: {
          OR: [
            { nombre: { contains: query } },
            { funcion_principal: { contains: query } },
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
      integraciones: integraciones.map(i => ({ ...i, type: 'integraciones' })),
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('Global search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
