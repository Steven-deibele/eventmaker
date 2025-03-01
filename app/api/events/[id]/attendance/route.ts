import { NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if the user is attending the event
    const attendance = await prisma.attendance.findUnique({
      where: {
        eventId_userId: {
          eventId: id,
          userId: session.user.id as string,
        },
      },
    });

    if (!attendance) {
      return NextResponse.json({ message: 'Attendance not found' }, { status: 404 });
    }

    return NextResponse.json(attendance);
  } catch (error) {
    console.error('Error checking attendance:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 