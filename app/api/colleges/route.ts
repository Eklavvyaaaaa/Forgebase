import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
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

    const whereClause: Prisma.CollegeWhereInput = {};
    
    if (q) {
      whereClause.name = { contains: q };
    }
    if (state) {
      whereClause.state = state;
    }
    
    if (course || minFees || maxFees) {
      whereClause.courses = { some: {} };
      if (course) whereClause.courses!.some!.name = { contains: course };
      if (minFees !== undefined) whereClause.courses!.some!.totalFees = { gte: minFees };
      if (maxFees !== undefined) {
        whereClause.courses!.some!.totalFees = { 
          ...(whereClause.courses!.some!.totalFees as Prisma.IntFilter), 
          lte: maxFees 
        };
      }
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
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
