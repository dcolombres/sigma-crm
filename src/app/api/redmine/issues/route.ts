import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  if (!user || !user.redmine_api_key) {
    return NextResponse.json({ error: 'Redmine API key not configured.' }, { status: 401 });
  }

  try {
    const response = await fetch('https://redmine.produccion.gob.ar/issues.json?assigned_to_id=me', {
      headers: {
        'X-Redmine-API-Key': user.redmine_api_key,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch issues from Redmine.' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}