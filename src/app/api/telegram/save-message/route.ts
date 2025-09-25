import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

const API_KEY = process.env.TELEGRAM_WEBHOOK_API_KEY;

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key');
  if (apiKey !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { message_id, chat_id, text, date } = body;

    if (message_id === undefined || chat_id === undefined || text === undefined || date === undefined) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    await prisma.telegramMessage.create({
      data: {
        message_id: message_id,
        chat_id: String(chat_id),
        text: text,
        date: new Date(date * 1000), // La fecha de Telegram es una marca de tiempo Unix
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
