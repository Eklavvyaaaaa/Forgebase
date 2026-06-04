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

    // Find cutoffs where the user's rank is less than or equal to the closeRank
    // We'll consider rank <= closeRank as a match. 
    // If rank <= openRank, it's a 'Good Match'
    // If openRank < rank <= closeRank, it's a 'Possible'
    // If rank is slightly above closeRank (e.g., +10%), it's a 'Reach'

    const reachThreshold = rank * 0.9; // 10% higher rank in competitive terms means numerically lower.
    // Actually, smaller rank is better.
    // If userRank = 5000, closeRank = 6000 -> userRank is better (Good Match / Possible)
    // If userRank = 6500, closeRank = 6000 -> userRank is worse, but close -> Reach.
    
    // Let's just fetch all where closeRank >= userRank * 0.8 (fetch up to 20% reach)
    const cutoffs = await prisma.cutoff.findMany({
      where: {
        exam,
        category,
        closeRank: { gte: Math.floor(rank * 0.8) } // fetch anything where closing rank is higher or slightly lower than user rank
      },
      include: {
        college: true
      },
      orderBy: {
        closeRank: 'asc'
      },
      take: 20
    });

    const results = cutoffs.map(cutoff => {
      let confidence = 'Reach';
      if (rank <= cutoff.openRank) {
        confidence = 'Good Match';
      } else if (rank <= cutoff.closeRank) {
        confidence = 'Possible';
      }

      return {
        cutoff,
        confidence,
        college: cutoff.college
      };
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in rank predictor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
