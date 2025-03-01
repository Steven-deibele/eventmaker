import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Event validation schema
const eventSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  isPublic: z.boolean().default(false),
});

// Generate a unique, readable code for the event
function generateEventCode(): string {
  // Generate a 6-character alphanumeric code (excluding ambiguous characters)
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    code += characters.charAt(randomIndex);
  }
  
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    
    // Validate event data
    const validatedData = eventSchema.parse(body);

    // Generate a unique event code
    const eventCode = generateEventCode();

    // Create the event
    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || '',
        location: validatedData.location || '',
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        capacity: validatedData.capacity || null,
        isPublic: validatedData.isPublic,
        code: eventCode,
        creator: {
          connect: {
            email: session.user.email as string,
          },
        },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid event data', errors: error.errors }, { status: 400 });
    }
    
    console.error('Error creating event:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 