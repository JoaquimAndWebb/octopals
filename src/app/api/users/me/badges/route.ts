import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

/**
 * GET /api/users/me/badges
 * Get user's earned badges
 */
export async function GET() {
  try {
    const user = await requireAuth()

    const userBadges = await prisma.userBadge.findMany({
      where: { userId: user.id },
      include: {
        badge: {
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            category: true,
            requirement: true,
          },
        },
      },
      orderBy: { earnedAt: 'desc' },
    })

    // Group badges by category
    type BadgeWithEarnedAt = typeof userBadges[0]['badge'] & { earnedAt: Date }
    const badgesByCategory = userBadges.reduce<Record<string, BadgeWithEarnedAt[]>>((acc, ub) => {
      const category = ub.badge.category
      if (!acc[category]) {
        acc[category] = [] as BadgeWithEarnedAt[]
      }
      acc[category].push({
        ...ub.badge,
        earnedAt: ub.earnedAt,
      })
      return acc
    }, {})

    // Get total available badges for comparison
    const totalBadges = await prisma.badge.count()

    return NextResponse.json({
      data: {
        badges: userBadges.map((ub) => ({
          ...ub.badge,
          earnedAt: ub.earnedAt,
        })),
        byCategory: badgesByCategory,
        stats: {
          earned: userBadges.length,
          total: totalBadges,
          percentage: totalBadges > 0
            ? Math.round((userBadges.length / totalBadges) * 100)
            : 0,
        },
      },
    })
  } catch (error) {
    console.error('Error getting user badges:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to get user badges' },
      { status: 500 }
    )
  }
}
