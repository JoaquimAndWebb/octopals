import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

/**
 * GET /api/users/me/clubs
 * List clubs user is a member of
 */
export async function GET() {
  try {
    const user = await requireAuth()

    const memberships = await prisma.clubMember.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      include: {
        club: {
          include: {
            _count: {
              select: {
                members: true,
                sessions: true,
              },
            },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    })

    const clubs = memberships.map((membership) => ({
      ...membership.club,
      role: membership.role,
      joinedAt: membership.joinedAt,
    }))

    return NextResponse.json({ data: clubs })
  } catch (error) {
    console.error('Error getting user clubs:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to get user clubs' },
      { status: 500 }
    )
  }
}
