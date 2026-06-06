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

    // Dream: Colleges where the closing rank is slightly lower than the user's rank (harder to get in)
    const dreamCutoffs = await prisma.cutoff.findMany({
      where: {
        exam,
        category,
        closeRank: { gte: Math.floor(rank * 0.7), lt: rank } // Up to 30% reach
      },
      include: { college: true },
      orderBy: { closeRank: 'desc' }, // Closest to the user's rank first
      take: 6
    });

    // Target: Colleges where the closing rank is near or slightly above the user's rank
    const targetCutoffs = await prisma.cutoff.findMany({
      where: {
        exam,
        category,
        closeRank: { gte: rank, lt: Math.floor(rank * 1.15) } // Up to 15% safety margin
      },
      include: { college: true },
      orderBy: { closeRank: 'asc' }, // Closest to the user's rank first
      take: 6
    });

    // Safe: Colleges where the closing rank is significantly higher than the user's rank
    const safeCutoffs = await prisma.cutoff.findMany({
      where: {
        exam,
        category,
        closeRank: { gte: Math.floor(rank * 1.15) }
      },
      include: { college: true },
      orderBy: { closeRank: 'asc' },
      take: 6
    });

    return NextResponse.json({
      dream: dreamCutoffs.map((cutoff: any) => ({ cutoff, confidence: 'Dream', college: cutoff.college })),
      target: targetCutoffs.map((cutoff: any) => ({ cutoff, confidence: 'Target', college: cutoff.college })),
      safe: safeCutoffs.map((cutoff: any) => ({ cutoff, confidence: 'Safe', college: cutoff.college }))
    });
  } catch (error) {
    console.error('Error in rank predictor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
