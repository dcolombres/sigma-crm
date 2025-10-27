import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  if (!type || !id) {
    return NextResponse.json({ error: 'Missing "type" or "id" parameter' }, { status: 400 });
  }

  const numericId = Number(id);
  if (isNaN(numericId)) {
    return NextResponse.json({ error: '"id" must be a number' }, { status: 400 });
  }

  let name: string | null = null;

  try {
    switch (type) {
      case 'proyectos':
        const proyecto = await prisma.proyecto.findUnique({ where: { id: numericId }, select: { nombre: true } });
        name = proyecto?.nombre || null;
        break;
      case 'staff':
        const staff = await prisma.staff.findUnique({ where: { id: numericId }, select: { nombres: true, apellidos: true } });
        name = staff ? `${staff.nombres} ${staff.apellidos}` : null;
        break;
      case 'clientes':
        const cliente = await prisma.cliente.findUnique({ where: { id: numericId }, select: { nombre: true } });
        name = cliente?.nombre || null;
        break;

      default:
        return NextResponse.json({ error: 'Invalid "type" parameter' }, { status: 400 });
    }

    if (name === null) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json({ name });
  } catch (error) {
    console.error('Breadcrumbs API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}