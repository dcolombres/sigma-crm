import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const proyecto = await prisma.proyecto.findUnique({
      where: { id: parseInt(id) },
      include: {
        staff: true,
        responsable: true,
        subresponsable: true,
        cliente: true,
      },
    });
    if (!proyecto) {
      return NextResponse.json({ error: 'Proyecto not found' }, { status: 404 });
    }
    return NextResponse.json(proyecto);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching proyecto' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const data = await request.json();
    const updatedProyecto = await prisma.proyecto.update({
      where: { id: parseInt(id) },
      data,
    });
    return NextResponse.json(updatedProyecto);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error updating proyecto' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await prisma.proyecto.delete({
      where: { id: parseInt(id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error deleting proyecto' }, { status: 500 });
  }
}
