import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { notFound } from 'next/navigation';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: id_str } = await params;
  const id = Number(id_str);
  if (isNaN(id)) {
    return new NextResponse('Invalid ID', { status: 400 });
  }

  const proyecto = await prisma.proyecto.findUnique({
    where: { id },
    select: { captura_data: true, captura_type: true },
  });

  if (!proyecto || !proyecto.captura_data || !proyecto.captura_type) {
    return notFound();
  }

  const uint8Array = new Uint8Array(proyecto.captura_data);
  const arrayBuffer = uint8Array.buffer;
  const blob = new Blob([arrayBuffer], { type: proyecto.captura_type });

  return new NextResponse(blob, {
    headers: {
      'Content-Type': proyecto.captura_type,
    },
  });
}
