import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { reviewSchema } from '@/lib/schemas';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reviews = await prisma.review.findMany({
      where: { collegeId: params.id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const { rating, content } = parsed.data;

    // First ensure the user exists in our DB (Supabase auth trigger usually handles this, but just in case)
    let user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name || 'Anonymous User'
        }
      });
    }

    const review = await prisma.review.create({
      data: {
        collegeId: params.id,
        userId: user.id,
        rating,
        content,
      },
    });

    // Update college average rating
    const allReviews = await prisma.review.findMany({ where: { collegeId: params.id } });
    const newRating = allReviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / allReviews.length;

    await prisma.college.update({
      where: { id: params.id },
      data: { 
        rating: newRating,
        totalReviews: allReviews.length 
      }
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
