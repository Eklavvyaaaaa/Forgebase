import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const exam = url.searchParams.get('exam');
    const rank = parseInt(url.searchParams.get('rank') || '0', 10);
    const category = url.searchParams.get('category');

    let colleges = [];

    if (exam && rank && category) {
      // Fetch matching cutoffs
      const cutoffs = await prisma.cutoff.findMany({
        where: {
          exam,
          category,
          closeRank: {
            gte: Math.floor(rank * 0.5), // Include slight reaches
          }
        },
        include: {
          college: {
            include: {
              placements: true,
              courses: { take: 1 }
            }
          }
        },
        take: 100
      });

      // Deduplicate
      const uniqueMap = new Map();
      for (const c of cutoffs) {
        if (!uniqueMap.has(c.collegeId)) {
          uniqueMap.set(c.collegeId, c.college);
        }
      }
      colleges = Array.from(uniqueMap.values());
    } else {
      // Fallback to pool
      colleges = await prisma.college.findMany({
        include: {
          placements: true,
          courses: {
            take: 1
          }
        },
        take: 50,
      });
    }

    // Shuffle array and return a manageable stack size
    const shuffled = colleges.sort(() => Math.random() - 0.5).slice(0, 20);

    return NextResponse.json(shuffled);
  } catch (error) {
    console.error('Error fetching discovery colleges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
