import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';
import { notFound } from 'next/navigation';

async function takeScreenshot(url: string, id: number): Promise<string> {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const screenshotPath = path.join(uploadsDir, `proyecto-${id}.png`);
    await page.screenshot({ path: screenshotPath as any });

    return `/uploads/proyecto-${id}.png`;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
  }

  const { url } = await request.json();
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const screenshotUrl = await takeScreenshot(url, id);
    // await prisma.proyecto.update({
    //   where: { id },
    //   data: { captura_url: screenshotUrl },
    // });
    return NextResponse.json({ screenshotUrl });
  } catch (error) {
    console.error('Error taking screenshot:', error);
    return NextResponse.json({ error: 'Failed to take screenshot' }, { status: 500 });
  }
}

// export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//   const { id: id_str } = await params;
//   const id = Number(id_str);
//   if (isNaN(id)) {
//     return new NextResponse('Invalid ID', { status: 400 });
//   }
//
//   const proyecto = await prisma.proyecto.findUnique({
//     where: { id },
//     select: { captura_data: true, captura_type: true },
//   });
//
//   if (!proyecto || !proyecto.captura_data || !proyecto.captura_type) {
//     return notFound();
//   }
//
//   const uint8Array = new Uint8Array(proyecto.captura_data);
//   const arrayBuffer = uint8Array.buffer;
//   const blob = new Blob([arrayBuffer], { type: proyecto.captura_type });
//
//   return new NextResponse(blob, {
//     headers: {
//       'Content-Type': proyecto.captura_type,
//     },
//   });
// }
