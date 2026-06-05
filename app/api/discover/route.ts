import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch a pool of colleges with their placements and courses
    const colleges = await prisma.college.findMany({
      include: {
        placements: true,
        courses: {
          take: 1
        }
      },
      take: 50,
    });

    // Shuffle array
    const shuffled = colleges.sort(() => Math.random() - 0.5).slice(0, 15); // Return 15 to swipe

    return NextResponse.json(shuffled);
  } catch (error) {
    console.error('Error fetching discovery colleges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
