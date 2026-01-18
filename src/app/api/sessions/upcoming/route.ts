import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

const querySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).default(10),
  includeAttended: z.coerce.boolean().default(false),
})

/**
 * GET /api/sessions/upcoming
 * Get user's upcoming sessions (sessions they've RSVP'd YES to)
 */
export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const queryResult = querySchema.safeParse({
      limit: searchParams.get('limit') || undefined,
      includeAttended: searchParams.get('includeAttended') || undefined,
    })

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryResult.error.flatten() },
        { status: 400 }
      )
    }

    const query = queryResult.data
    const now = new Date()

    // Get upcoming sessions where user has RSVP'd YES
    const sessions = await prisma.session.findMany({
      where: {
        startTime: { gte: now },
        isCancelled: false,
        rsvps: {
          some: {
            userId: currentUser.db.id,
            status: 'YES',
          },
        },
      },
      orderBy: { startTime: 'asc' },
      take: query.limit,
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
          },
        },
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            latitude: true,
            longitude: true,
          },
        },
        rsvps: {
          where: {
            userId: currentUser.db.id,
          },
          select: {
            id: true,
            status: true,
            note: true,
          },
        },
        attendances: {
          where: {
            userId: currentUser.db.id,
          },
          select: {
            id: true,
            checkedInAt: true,
            method: true,
          },
        },
        _count: {
          select: { rsvps: true },
        },
      },
    })

    // Process sessions to flatten user's RSVP and attendance
    const processedSessions = sessions.map((session) => {
      const { rsvps, attendances, ...sessionData } = session
      return {
        ...sessionData,
        userRsvp: rsvps[0] || null,
        userAttendance: attendances[0] || null,
        isCheckedIn: attendances.length > 0,
      }
    })

    // Optionally filter out already attended sessions
    const filteredSessions = query.includeAttended
      ? processedSessions
      : processedSessions.filter((s) => !s.isCheckedIn)

    return NextResponse.json({
      data: filteredSessions,
      count: filteredSessions.length,
    })
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch upcoming sessions' },
      { status: 500 }
    )
  }
}
