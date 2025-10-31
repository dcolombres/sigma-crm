import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/google-sheets';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sheet = searchParams.get('sheet');

  if (!sheet) {
    return NextResponse.json({ error: 'Sheet name is required' }, { status: 400 });
  }

  try {
    const data = await getSheetData(sheet);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching data for sheet ${sheet}:`, error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
