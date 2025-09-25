import { NextResponse } from 'next/server';

export async function POST() {
  // For now, we just return a success message.
  // Later, we will implement session clearing.
  return NextResponse.json({ message: 'Logout successful' });
}
