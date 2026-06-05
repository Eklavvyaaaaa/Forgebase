import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { predictorSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = predictorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.format() }, { status: 400 });
    }

    const { exam, rank, category } = parsed.data;

    const cutoffs = await prisma.cutoff.findMany({
      where: {
        exam,
        category,
        closeRank: { gte: Math.floor(rank * 0.6) } // Fetch up to 40% reach
      },
      include: {
        college: true
      },
      orderBy: {
        closeRank: 'asc'
      },
      take: 100 // Fetch a large pool to categorize
    });

    const dream: any[] = [];
    const target: any[] = [];
    const safe: any[] = [];

    cutoffs.forEach(cutoff => {
      // A lower numerical rank is better
      if (rank <= cutoff.openRank) {
        safe.push({ cutoff, confidence: 'Safe', college: cutoff.college });
      } else if (rank <= cutoff.closeRank) {
        target.push({ cutoff, confidence: 'Target', college: cutoff.college });
      } else {
        dream.push({ cutoff, confidence: 'Dream', college: cutoff.college });
      }
    });

    // Return top 5-6 from each category for a focused UI
    return NextResponse.json({
      dream: dream.slice(0, 6),
      target: target.slice(0, 6),
      safe: safe.slice(0, 6)
    });
  } catch (error) {
    console.error('Error in rank predictor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
