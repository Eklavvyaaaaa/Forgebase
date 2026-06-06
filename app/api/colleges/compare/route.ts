import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    
    if (!idsParam) {
      return NextResponse.json({ error: 'Missing ids parameter' }, { status: 400 });
    }

    const ids = idsParam.split(',').map(id => id.trim()).filter(Boolean);
    
    if (ids.length === 0 || ids.length > 3) {
      return NextResponse.json({ error: 'Please provide between 1 and 3 college IDs' }, { status: 400 });
    }

    const colleges = await prisma.college.findMany({
      where: {
        id: { in: ids }
      },
      include: {
        courses: true,
        placements: true,
        cutoffs: true,
      }
    });

    // Ensure the returned order matches the requested order if possible, or just return as is
    const sortedColleges = ids.map(id => colleges.find((c: any) => c.id === id)).filter(Boolean);

    return NextResponse.json(sortedColleges);
  } catch (error) {
    console.error('Error fetching colleges for comparison:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
