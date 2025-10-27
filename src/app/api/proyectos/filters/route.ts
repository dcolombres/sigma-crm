import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // This API route is considered obsolete as it was querying
    // non-existent fields (tier, estado, salud, etc.) from the Proyecto model.
    // Returning empty arrays to prevent breaking any UI that might call this endpoint.
    // TODO: Remove this route and any components that use it, or update it
    // to fetch filters from valid fields if still needed.
    const filters = {
      tiers: [],
      estados: [],
      salud: [],
      prioridades: [],
      areas: [],
    };
    return NextResponse.json(filters);
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 });
  }
}