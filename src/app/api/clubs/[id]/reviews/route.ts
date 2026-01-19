import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createReviewSchema } from '@/lib/validations/club'

type RouteParams = { params: Promise<{ id: string }> }

// Query params schema for GET
const listReviewsQuerySchema = z.object({
  rating: z.coerce.number().int().min(1).max(5).optional(),
  sortBy: z.enum(['createdAt', 'rating']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

/**
 * GET /api/clubs/[id]/reviews
 * List club reviews
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
    const queryResult = listReviewsQuerySchema.safeParse({
      rating: searchParams.get('rating') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
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

    if (query.rating) {
      where.rating = query.rating
    }

    // Execute query
    const [reviews, total, ratingStats] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: { [query.sortBy]: query.sortOrder },
        include: {
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
      }),
      prisma.review.count({ where }),
      prisma.review.groupBy({
        by: ['rating'],
        where: { clubId: id },
        _count: { rating: true },
      }),
    ])

    // Calculate rating distribution
    const ratingDistribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }
    ratingStats.forEach((stat) => {
      ratingDistribution[stat.rating] = stat._count.rating
    })

    // Calculate average rating
    const totalReviews = Object.values(ratingDistribution).reduce((a, b) => a + b, 0)
    const averageRating =
      totalReviews > 0
        ? Math.round(
            (Object.entries(ratingDistribution).reduce(
              (sum, [rating, count]) => sum + Number(rating) * count,
              0
            ) /
              totalReviews) *
              10
          ) / 10
        : null

    return NextResponse.json({
      data: reviews,
      club: {
        id: club.id,
        name: club.name,
      },
      stats: {
        averageRating,
        totalReviews,
        ratingDistribution,
      },
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    })
  } catch (error) {
    console.error('Error listing club reviews:', error)
    return NextResponse.json(
      { error: 'Failed to list club reviews' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/clubs/[id]/reviews
 * Create a review (requires auth, one per user per club)
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
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

    // Get current user from database
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

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

    // Check if user already has a review for this club
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_clubId: {
          userId: currentUser.id,
          clubId: id,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this club. Please update your existing review instead.' },
        { status: 400 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = createReviewSchema.omit({ clubId: true }).safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: currentUser.id,
        clubId: id,
        rating: data.rating,
        content: data.content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        data: review,
        message: 'Review created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
