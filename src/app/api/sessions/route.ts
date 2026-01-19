import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, requireClubAdmin } from '@/lib/auth'
import { createSessionSchema, sessionFiltersSchema } from '@/lib/validations/session'

/**
 * GET /api/sessions
 * List sessions with filters (clubId, type, skillLevel, startDate, endDate)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const queryResult = sessionFiltersSchema.safeParse({
      clubId: searchParams.get('clubId') || undefined,
      type: searchParams.get('type') || undefined,
      skillLevel: searchParams.get('skillLevel') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      includesCancelled: searchParams.get('includesCancelled') || undefined,
      page: searchParams.get('page') || undefined,
      pageSize: searchParams.get('pageSize') || undefined,
    })

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryResult.error.flatten() },
        { status: 400 }
      )
    }

    const query = queryResult.data
    const skip = (query.page - 1) * query.pageSize

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    // Club filter
    if (query.clubId) {
      where.clubId = query.clubId
    }

    // Type filter
    if (query.type) {
      where.type = query.type
    }

    // Skill level filter
    if (query.skillLevel) {
      where.skillLevel = query.skillLevel
    }

    // Date range filters
    if (query.startDate) {
      where.startTime = { ...where.startTime, gte: query.startDate }
    }
    if (query.endDate) {
      where.startTime = { ...where.startTime, lte: query.endDate }
    }

    // Cancelled filter
    if (!query.includesCancelled) {
      where.isCancelled = false
    }

    // Execute query
    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where,
        orderBy: { startTime: 'asc' },
        skip,
        take: query.pageSize,
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
            },
          },
          _count: {
            select: { rsvps: true, attendances: true },
          },
          rsvps: {
            where: { status: 'YES' },
            select: { id: true },
          },
        },
      }),
      prisma.session.count({ where }),
    ])

    // Process sessions to add RSVP counts
    const processedSessions = sessions.map((session) => {
      const { rsvps, ...sessionData } = session
      return {
        ...sessionData,
        yesCount: rsvps.length,
      }
    })

    return NextResponse.json({
      data: processedSessions,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    })
  } catch (error) {
    console.error('Error listing sessions:', error)
    return NextResponse.json(
      { error: 'Failed to list sessions' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/sessions
 * Create a new session (requires club admin)
 */
export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json()
    const validationResult = createSessionSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Verify user is a club admin
    try {
      await requireClubAdmin(data.clubId)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unauthorized'
      return NextResponse.json({ error: message }, { status: 403 })
    }

    // Verify venue belongs to the club if provided
    if (data.venueId) {
      const venue = await prisma.venue.findUnique({
        where: { id: data.venueId },
      })
      if (!venue || venue.clubId !== data.clubId) {
        return NextResponse.json(
          { error: 'Invalid venue for this club' },
          { status: 400 }
        )
      }
    }

    // Create session
    const session = await prisma.session.create({
      data: {
        ...data,
        createdById: currentUser.db.id,
      },
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
          select: { rsvps: true },
        },
      },
    })

    return NextResponse.json(
      { data: session, message: 'Session created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}
