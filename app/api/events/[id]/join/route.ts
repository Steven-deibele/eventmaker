import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Find the event
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            attendances: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    // Check if the event is at capacity
    if (event.capacity !== null && event._count.attendances >= event.capacity) {
      return NextResponse.json({ message: 'This event is at capacity' }, { status: 400 });
    }

    // Check if the user is already attending
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        eventId_userId: {
          eventId: id,
          userId: session.user.id as string,
        },
      },
    });

    if (existingAttendance) {
      return NextResponse.json({ message: 'You are already attending this event' }, { status: 400 });
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        event: {
          connect: { id },
        },
        user: {
          connect: { id: session.user.id as string },
        },
        status: 'confirmed',
      },
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    console.error('Error joining event:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 