import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sheet = searchParams.get('sheet');

  if (!sheet) {
    return NextResponse.json({ error: 'Sheet name is required' }, { status: 400 });
  }

  try {
    let columns: string[] = [];
    if (sheet === 'PROYECTOS') {
      columns = Object.keys(Prisma.dmmf.datamodel.models.find(model => model.name === 'DprProyecto')?.fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}) || {});
    } else if (sheet === 'STAFF') {
      columns = Object.keys(Prisma.dmmf.datamodel.models.find(model => model.name === 'DprStaff')?.fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}) || {});
    } else {
      return NextResponse.json({ error: 'Invalid sheet name' }, { status: 400 });
    }
    return NextResponse.json({ columns });
  } catch (error) {
    console.error(`Error fetching columns for sheet ${sheet}:`, error);
    return NextResponse.json({ error: 'Failed to fetch columns' }, { status: 500 });
  }
}
