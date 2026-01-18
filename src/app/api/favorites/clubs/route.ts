import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

/**
 * GET /api/favorites/clubs
 * Get user's favorite clubs
 */
export async function GET() {
  try {
    const user = await requireAuth()

    const favorites = await prisma.favoriteClub.findMany({
      where: { userId: user.id },
      include: {
        club: {
          include: {
            _count: {
              select: {
                members: true,
                sessions: true,
                reviews: true,
              },
            },
            reviews: {
              select: { rating: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Process clubs with average rating
    const clubs = favorites.map((fav) => {
      const avgRating =
        fav.club.reviews.length > 0
          ? fav.club.reviews.reduce((sum, r) => sum + r.rating, 0) / fav.club.reviews.length
          : null

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { reviews, ...clubWithoutReviews } = fav.club

      return {
        ...clubWithoutReviews,
        averageRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
        favoritedAt: fav.createdAt,
      }
    })

    return NextResponse.json({ data: clubs })
  } catch (error) {
    console.error('Error getting favorite clubs:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to get favorite clubs' },
      { status: 500 }
    )
  }
}
