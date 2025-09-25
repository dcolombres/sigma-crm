import { NextResponse } from 'next/server';

export async function POST() {
  // Por ahora, solo devolvemos un mensaje de éxito.
  // Más adelante, implementaremos el borrado de la sesión.
  return NextResponse.json({ message: 'Logout successful' });
}
