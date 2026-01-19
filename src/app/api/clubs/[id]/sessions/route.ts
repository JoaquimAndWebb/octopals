import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { SessionType, SkillLevel } from '@prisma/client'

type RouteParams = { params: Promise<{ id: string }> }

// Query params schema
const listSessionsQuerySchema = z.object({
  type: z.nativeEnum(SessionType).optional(),
  skillLevel: z.nativeEnum(SkillLevel).optional(),
  upcoming: z.coerce.boolean().default(true),
  includeCancelled: z.coerce.boolean().default(false),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

/**
 * GET /api/clubs/[id]/sessions
 * List club's sessions (upcoming by default)
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)

    // Verify club exists
    const club = await prisma.club.findUnique({
      where: { id },
      select: { id: true, name: true },
    })

    if (!club) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      )
    }

    // Parse query parameters
    const queryResult = listSessionsQuerySchema.safeParse({
      type: searchParams.get('type') || undefined,
      skillLevel: searchParams.get('skillLevel') || undefined,
      upcoming: searchParams.get('upcoming') ?? 'true',
      includeCancelled: searchParams.get('includeCancelled') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    })

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryResult.error.flatten() },
        { status: 400 }
      )
    }

    const query = queryResult.data
    const skip = (query.page - 1) * query.limit

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      clubId: id,
    }

    // Filter by session type
    if (query.type) {
      where.type = query.type
    }

    // Filter by skill level
    if (query.skillLevel) {
      where.skillLevel = query.skillLevel
    }

    // Filter cancelled sessions
    if (!query.includeCancelled) {
      where.isCancelled = false
    }

    // Date filters
    if (query.upcoming) {
      where.startTime = { gte: new Date() }
    }
    if (query.startDate) {
      where.startTime = {
        ...where.startTime,
        gte: query.startDate,
      }
    }
    if (query.endDate) {
      where.endTime = { lte: query.endDate }
    }

    // Execute query
    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: { startTime: query.upcoming ? 'asc' : 'desc' },
        include: {
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
            select: {
              id: true,
              status: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                  imageUrl: true,
                },
              },
            },
          },
          _count: {
            select: {
              rsvps: true,
              attendances: true,
            },
          },
        },
      }),
      prisma.session.count({ where }),
    ])

    // Transform sessions to include RSVP counts by status
    const transformedSessions = sessions.map((session) => {
      const rsvpCounts = {
        yes: session.rsvps.filter((r) => r.status === 'YES').length,
        no: session.rsvps.filter((r) => r.status === 'NO').length,
        maybe: session.rsvps.filter((r) => r.status === 'MAYBE').length,
      }

      return {
        id: session.id,
        title: session.title,
        description: session.description,
        type: session.type,
        skillLevel: session.skillLevel,
        startTime: session.startTime,
        endTime: session.endTime,
        maxAttendees: session.maxAttendees,
        isCancelled: session.isCancelled,
        cancelReason: session.cancelReason,
        isRecurring: session.isRecurring,
        venue: session.venue,
        rsvpCounts,
        spotsRemaining: session.maxAttendees
          ? Math.max(0, session.maxAttendees - rsvpCounts.yes)
          : null,
        attendeeCount: session._count.attendances,
      }
    })

    return NextResponse.json({
      data: transformedSessions,
      club: {
        id: club.id,
        name: club.name,
      },
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    })
  } catch (error) {
    console.error('Error listing club sessions:', error)
    return NextResponse.json(
      { error: 'Failed to list club sessions' },
      { status: 500 }
    )
  }
}
