import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

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

    const existingSave = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: user.id,
          collegeId: params.id,
        }
      }
    });

    if (existingSave) {
      await prisma.savedCollege.delete({
        where: { id: existingSave.id }
      });
      return NextResponse.json({ saved: false });
    } else {
      await prisma.savedCollege.create({
        data: {
          userId: user.id,
          collegeId: params.id,
        }
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error('Error toggling save college:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
