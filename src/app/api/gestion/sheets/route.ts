import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sheets = ['PROYECTOS', 'STAFF'];
    return NextResponse.json({ sheets });
  } catch (error) {
    console.error('Error fetching sheet names:', error);
    return NextResponse.json({ error: 'Failed to fetch sheet names' }, { status: 500 });
  }
}
