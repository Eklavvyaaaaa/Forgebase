import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      include: {
        college: {
          include: {
            courses: { take: 1, orderBy: { totalFees: 'asc' } }
          }
        }
      }
    });

    return NextResponse.json(savedColleges.map(sc => sc.college));
  } catch (error) {
    console.error('Error fetching saved colleges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { collegeId } = await request.json();

    if (!collegeId) {
      return NextResponse.json({ error: 'Missing collegeId' }, { status: 400 });
    }

    const saved = await prisma.savedCollege.create({
      data: {
        userId: session.user.id,
        collegeId
      }
    });

    return NextResponse.json(saved);
  } catch (error) {
    console.error('Error saving college:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
