import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.length < 2) {
      return NextResponse.json([]);
    }

    const colleges = await prisma.college.findMany({
      where: {
        name: {
          contains: q,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        state: true
      },
      take: 5
    });

    return NextResponse.json(colleges);
  } catch (error) {
    console.error('Error in autocomplete:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
