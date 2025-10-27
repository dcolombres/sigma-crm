import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sheet = searchParams.get('sheet');
  const column = searchParams.get('column');

  if (!sheet || !column) {
    return NextResponse.json({ error: 'Sheet and column are required' }, { status: 400 });
  }

  // This API route is considered obsolete as it was querying
  // dprProyecto and dprStaff models that have been deleted.
  // Returning empty array to prevent breaking any UI that might call this endpoint.
  // TODO: Remove this route and any components that use it.
  if (sheet === 'PROYECTOS' || sheet === 'STAFF') {
    return NextResponse.json({ values: [] });
  }

  return NextResponse.json({ error: 'Invalid sheet name' }, { status: 400 });
}
