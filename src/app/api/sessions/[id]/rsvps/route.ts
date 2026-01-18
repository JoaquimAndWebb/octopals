import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{ id: string }>
}

const querySchema = z.object({
  status: z.enum(['YES', 'NO', 'MAYBE']).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(50),
})

/**
 * GET /api/sessions/[id]/rsvps
 * List all RSVPs for a session (with user info)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: sessionId } = await params
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const queryResult = querySchema.safeParse({
      status: searchParams.get('status') || undefined,
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

    // Check if session exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { id: true, title: true },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      sessionId,
    }

    if (query.status) {
      where.status = query.status
    }

    // Get RSVPs with user info
    const [rsvps, total] = await Promise.all([
      prisma.sessionRsvp.findMany({
        where,
        orderBy: [
          { status: 'asc' }, // YES first, then MAYBE, then NO
          { createdAt: 'desc' },
        ],
        skip,
        take: query.pageSize,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
              skillLevel: true,
              primaryPosition: true,
            },
          },
        },
      }),
      prisma.sessionRsvp.count({ where }),
    ])

    // Get counts by status
    const [yesCount, noCount, maybeCount] = await Promise.all([
      prisma.sessionRsvp.count({ where: { sessionId, status: 'YES' } }),
      prisma.sessionRsvp.count({ where: { sessionId, status: 'NO' } }),
      prisma.sessionRsvp.count({ where: { sessionId, status: 'MAYBE' } }),
    ])

    return NextResponse.json({
      data: rsvps,
      counts: {
        yes: yesCount,
        no: noCount,
        maybe: maybeCount,
        total: yesCount + noCount + maybeCount,
      },
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    })
  } catch (error) {
    console.error('Error listing RSVPs:', error)
    return NextResponse.json(
      { error: 'Failed to list RSVPs' },
      { status: 500 }
    )
  }
}
