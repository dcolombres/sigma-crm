import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters: any = {};
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '10');
  const skip = (page - 1) * perPage;

  // Build the filter object from query params
  searchParams.forEach((value, key) => {
    if (key !== 'sheet' && key !== 'page' && key !== 'perPage' && value) {
      if (key.includes('.')) {
        const [relation, field] = key.split('.');
        filters[relation] = {
          [field]: { contains: value, mode: 'insensitive' },
        };
      } else if (key === 'tier') {
        filters[key] = parseInt(value);
      } else {
        filters[key] = { contains: value, mode: 'insensitive' };
      }
    }
  });

  console.log('Filters:', JSON.stringify(filters, null, 2));

  try {
    const [proyectos, count] = await Promise.all([
      prisma.proyecto.findMany({
        where: filters,
        include: {
          staff: true,
          responsable: true,
          subresponsable: true,
          cliente: true,
        },
        skip,
        take: perPage,
      }),
      prisma.proyecto.count({ where: filters }),
    ]);
    return NextResponse.json({ proyectos, count });
  } catch (error) {
    console.error('Error in /api/proyectos:', error);
    return NextResponse.json({ error: 'Error fetching proyectos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newProyecto = await prisma.proyecto.create({ data });
    return NextResponse.json(newProyecto, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating proyecto' }, { status: 500 });
  }
}