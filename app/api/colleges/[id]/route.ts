import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const isSlug = isNaN(Number(params.id)) && !params.id.includes('-'); // Rough check, but Prisma id is cuid. So slug doesn't look like cuid. Actually, wait. The requirement says /colleges/[slug] for the page. Let's support both slug and ID here.

    const college = await prisma.college.findFirst({
      where: {
        OR: [
          { id: params.id },
          { slug: params.id }
        ]
      },
      include: {
        courses: true,
        placements: true,
      }
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error('Error fetching college details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
