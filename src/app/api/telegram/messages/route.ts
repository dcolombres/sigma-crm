import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.staff.findUnique({ where: { email: session.user.email } });

  if (!user || !user.telegram_chat_id) {
    return NextResponse.json({ error: 'Telegram Chat ID not configured.' }, { status: 401 });
  }

  const { telegram_chat_id } = user;

  try {
    const messages = await prisma.telegramMessage.findMany({
      where: {
        chat_id: telegram_chat_id,
      },
      orderBy: {
        date: 'desc',
      },
      take: 10,
    });

    // The frontend expects a 'result' property with the messages
    return NextResponse.json({ ok: true, result: messages });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}