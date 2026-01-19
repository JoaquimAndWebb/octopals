import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { requireClubAdmin } from '@/lib/auth'
import { updateSessionSchema } from '@/lib/validations/session'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/sessions/[id]
 * Get a single session with venue, club, and RSVP counts
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            city: true,
            country: true,
          },
        },
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            country: true,
            latitude: true,
            longitude: true,
            poolLength: true,
            poolWidth: true,
            poolDepth: true,
          },
        },
        rsvps: {
          select: {
            id: true,
            status: true,
            userId: true,
          },
        },
        _count: {
          select: { rsvps: true, attendances: true },
        },
      },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Calculate RSVP counts by status
    const rsvpCounts = {
      yes: session.rsvps.filter((r) => r.status === 'YES').length,
      no: session.rsvps.filter((r) => r.status === 'NO').length,
      maybe: session.rsvps.filter((r) => r.status === 'MAYBE').length,
      total: session.rsvps.length,
    }

    // Remove individual RSVPs from response (use /api/sessions/[id]/rsvps for that)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rsvps, ...sessionData } = session

    return NextResponse.json({
      data: {
        ...sessionData,
        rsvpCounts,
      },
    })
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/sessions/[id]
 * Update a session (requires club admin)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Find the session first
    const existingSession = await prisma.session.findUnique({
      where: { id },
      select: { id: true, clubId: true },
    })

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Verify user is a club admin
    try {
      await requireClubAdmin(existingSession.clubId)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unauthorized'
      return NextResponse.json({ error: message }, { status: 403 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = updateSessionSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Verify venue belongs to the club if being updated
    if (data.venueId) {
      const venue = await prisma.venue.findUnique({
        where: { id: data.venueId },
      })
      if (!venue || venue.clubId !== existingSession.clubId) {
        return NextResponse.json(
          { error: 'Invalid venue for this club' },
          { status: 400 }
        )
      }
    }

    // Update session
    const session = await prisma.session.update({
      where: { id },
      data,
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
          },
        },
        _count: {
          select: { rsvps: true, attendances: true },
        },
      },
    })

    return NextResponse.json({
      data: session,
      message: 'Session updated successfully',
    })
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/sessions/[id]
 * Cancel/delete a session (requires club admin)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Find the session first
    const existingSession = await prisma.session.findUnique({
      where: { id },
      select: { id: true, clubId: true, startTime: true },
    })

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Verify user is a club admin
    try {
      await requireClubAdmin(existingSession.clubId)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unauthorized'
      return NextResponse.json({ error: message }, { status: 403 })
    }

    // If session is in the future, cancel it instead of deleting
    // This preserves historical data
    const now = new Date()
    if (existingSession.startTime > now) {
      // Cancel the session
      const session = await prisma.session.update({
        where: { id },
        data: {
          isCancelled: true,
          cancelReason: 'Cancelled by admin',
        },
      })

      return NextResponse.json({
        data: session,
        message: 'Session cancelled successfully',
      })
    } else {
      // Delete past sessions
      await prisma.session.delete({
        where: { id },
      })

      return NextResponse.json({
        message: 'Session deleted successfully',
      })
    }
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    )
  }
}
