import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  // This API route is considered obsolete as it was querying
  // the dprStaff model which has been deleted.
  // Returning empty array to prevent breaking any UI that might call this endpoint.
  // TODO: Remove this route and any components that use it, or update it
  // to fetch from the correct 'Staff' model if still needed.
  return NextResponse.json([]);
}