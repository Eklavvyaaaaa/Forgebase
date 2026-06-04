import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { collegeSearchSchema } from '@/lib/schemas';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    const parsed = collegeSearchSchema.safeParse(params);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const { q, state, course, minFees, maxFees, page } = parsed.data;
    const limit = 12;
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    
    if (q) {
      whereClause.name = { contains: q, mode: 'insensitive' };
    }
    if (state) {
      whereClause.state = state;
    }
    
    if (course || minFees || maxFees) {
      whereClause.courses = { some: {} };
      if (course) whereClause.courses.some.name = { contains: course, mode: 'insensitive' };
      if (minFees !== undefined) whereClause.courses.some.totalFees = { gte: minFees };
      if (maxFees !== undefined) whereClause.courses.some.totalFees = { ...whereClause.courses.some.totalFees, lte: maxFees };
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where: whereClause,
        include: {
          courses: {
            take: 1,
            orderBy: { totalFees: 'asc' }
          }
        },
        skip,
        take: limit,
        orderBy: { nirfRank: 'asc' }
      }),
      prisma.college.count({ where: whereClause })
    ]);

    return NextResponse.json({
      data: colleges,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
