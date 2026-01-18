import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteContext = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/competitions/[id]
 * Get a single competition with follower count
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    const competition = await prisma.competition.findUnique({
      where: { id },
      include: {
        _count: {
          select: { followers: true },
        },
        results: {
          orderBy: { placement: 'asc' },
        },
      },
    })

    if (!competition) {
      return NextResponse.json(
        { error: 'Competition not found' },
        { status: 404 }
      )
    }

    // Don't expose unpublished competitions
    if (!competition.isPublished) {
      return NextResponse.json(
        { error: 'Competition not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...competition,
      followerCount: competition._count.followers,
      _count: undefined,
    })
  } catch (error) {
    console.error('Error fetching competition:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competition' },
      { status: 500 }
    )
  }
}
