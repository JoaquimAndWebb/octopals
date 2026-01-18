import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { rsvpSchema } from '@/lib/validations/session'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/sessions/[id]/rsvp
 * Get current user's RSVP for this session
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: sessionId } = await params

    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get current user from database
    const currentUser = await getCurrentUser()
    if (!currentUser?.db) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    // Check if session exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { id: true },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Get user's RSVP
    const rsvp = await prisma.sessionRsvp.findUnique({
      where: {
        sessionId_userId: {
          sessionId,
          userId: currentUser.db.id,
        },
      },
    })

    if (!rsvp) {
      return NextResponse.json({
        data: null,
        message: 'No RSVP found',
      })
    }

    return NextResponse.json({ data: rsvp })
  } catch (error) {
    console.error('Error fetching RSVP:', error)
    return NextResponse.json(
      { error: 'Failed to fetch RSVP' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/sessions/[id]/rsvp
 * Create or update RSVP for current user (status: YES, NO, MAYBE)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: sessionId } = await params

    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get current user from database
    const currentUser = await getCurrentUser()
    if (!currentUser?.db) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = rsvpSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check if session exists and is not cancelled
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        isCancelled: true,
        maxAttendees: true,
        startTime: true,
        rsvps: {
          where: { status: 'YES' },
          select: { id: true },
        },
      },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    if (session.isCancelled) {
      return NextResponse.json(
        { error: 'Cannot RSVP to a cancelled session' },
        { status: 400 }
      )
    }

    // Check if session is in the past
    if (session.startTime < new Date()) {
      return NextResponse.json(
        { error: 'Cannot RSVP to a past session' },
        { status: 400 }
      )
    }

    // Check max attendees if RSVPing YES
    if (data.status === 'YES' && session.maxAttendees) {
      const existingRsvp = await prisma.sessionRsvp.findUnique({
        where: {
          sessionId_userId: {
            sessionId,
            userId: currentUser.db.id,
          },
        },
      })

      // Only check capacity if user is not already RSVP'd YES
      if (!existingRsvp || existingRsvp.status !== 'YES') {
        if (session.rsvps.length >= session.maxAttendees) {
          return NextResponse.json(
            { error: 'Session is at maximum capacity' },
            { status: 400 }
          )
        }
      }
    }

    // Create or update RSVP (upsert)
    const rsvp = await prisma.sessionRsvp.upsert({
      where: {
        sessionId_userId: {
          sessionId,
          userId: currentUser.db.id,
        },
      },
      update: {
        status: data.status,
        note: data.note,
      },
      create: {
        sessionId,
        userId: currentUser.db.id,
        status: data.status,
        note: data.note,
      },
      include: {
        session: {
          select: {
            id: true,
            title: true,
            startTime: true,
          },
        },
      },
    })

    return NextResponse.json({
      data: rsvp,
      message: 'RSVP saved successfully',
    })
  } catch (error) {
    console.error('Error saving RSVP:', error)
    return NextResponse.json(
      { error: 'Failed to save RSVP' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/sessions/[id]/rsvp
 * Remove current user's RSVP
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: sessionId } = await params

    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get current user from database
    const currentUser = await getCurrentUser()
    if (!currentUser?.db) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    // Check if RSVP exists
    const rsvp = await prisma.sessionRsvp.findUnique({
      where: {
        sessionId_userId: {
          sessionId,
          userId: currentUser.db.id,
        },
      },
    })

    if (!rsvp) {
      return NextResponse.json(
        { error: 'RSVP not found' },
        { status: 404 }
      )
    }

    // Delete RSVP
    await prisma.sessionRsvp.delete({
      where: {
        sessionId_userId: {
          sessionId,
          userId: currentUser.db.id,
        },
      },
    })

    return NextResponse.json({
      message: 'RSVP removed successfully',
    })
  } catch (error) {
    console.error('Error removing RSVP:', error)
    return NextResponse.json(
      { error: 'Failed to remove RSVP' },
      { status: 500 }
    )
  }
}
