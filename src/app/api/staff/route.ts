import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters: any = {};
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '10');
  const skip = (page - 1) * perPage;

  // Build the filter object from query params
  searchParams.forEach((value, key) => {
    if (key !== 'page' && key !== 'perPage') {
      filters[key] = { contains: value, mode: 'insensitive' };
    }
  });

  try {
    const [staff, count] = await Promise.all([
      prisma.staff.findMany({
        where: filters,
        include: {
          proyectos: true,
          proyectos_responsable: true,
          proyectos_subresponsable: true,
          User: true,
        },
        skip,
        take: perPage,
      }),
      prisma.staff.count({ where: filters }),
    ]);
    return NextResponse.json({ staff, count });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching staff' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newStaff = await prisma.staff.create({ data });
    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating staff' }, { status: 500 });
  }
}
