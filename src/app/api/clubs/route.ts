import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { createClubSchema } from '@/lib/validations/club'
import { getBoundingBox, calculateDistance } from '@/lib/geo'
import { SkillLevel, ClubRole } from '@prisma/client'

// Query params schema for GET
const listClubsQuerySchema = z.object({
  search: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  skillLevel: z.nativeEnum(SkillLevel).optional(),
  welcomesBeginners: z.coerce.boolean().optional(),
  isVerified: z.coerce.boolean().optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().positive().default(50), // km
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['name', 'createdAt', 'distance']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

/**
 * GET /api/clubs
 * List clubs with filters and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const queryResult = listClubsQuerySchema.safeParse({
      search: searchParams.get('search') || undefined,
      country: searchParams.get('country') || undefined,
      city: searchParams.get('city') || undefined,
      skillLevel: searchParams.get('skillLevel') || undefined,
      welcomesBeginners: searchParams.get('welcomesBeginners') || undefined,
      isVerified: searchParams.get('isVerified') || undefined,
      lat: searchParams.get('lat') || undefined,
      lng: searchParams.get('lng') || undefined,
      radius: searchParams.get('radius') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
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
      isActive: true,
    }

    // Search filter
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { city: { contains: query.search, mode: 'insensitive' } },
        { country: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    // Location filters
    if (query.country) {
      where.country = { equals: query.country, mode: 'insensitive' }
    }
    if (query.city) {
      where.city = { contains: query.city, mode: 'insensitive' }
    }

    // Boolean filters
    if (query.welcomesBeginners !== undefined) {
      where.welcomesBeginners = query.welcomesBeginners
    }
    if (query.isVerified !== undefined) {
      where.isVerified = query.isVerified
    }

    // Geospatial filter using bounding box
    if (query.lat !== undefined && query.lng !== undefined) {
      const boundingBox = getBoundingBox(query.lat, query.lng, query.radius)
      where.latitude = { gte: boundingBox.minLat, lte: boundingBox.maxLat }
      where.longitude = { gte: boundingBox.minLng, lte: boundingBox.maxLng }
    }

    // Build order by
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = {}
    if (query.sortBy === 'distance' && query.lat !== undefined && query.lng !== undefined) {
      // For distance sorting, we'll fetch all and sort in memory
      orderBy = { name: 'asc' }
    } else {
      orderBy = { [query.sortBy]: query.sortOrder }
    }

    // Execute query
    const [clubs, total] = await Promise.all([
      prisma.club.findMany({
        where,
        orderBy,
        skip: query.sortBy === 'distance' ? 0 : skip,
        take: query.sortBy === 'distance' ? undefined : query.limit,
        include: {
          _count: {
            select: { members: true, sessions: true, reviews: true },
          },
          reviews: {
            select: { rating: true },
          },
        },
      }),
      prisma.club.count({ where }),
    ])

    // Calculate average rating and add distance if needed
    let processedClubs = clubs.map((club) => {
      const avgRating =
        club.reviews.length > 0
          ? club.reviews.reduce((sum, r) => sum + r.rating, 0) / club.reviews.length
          : null

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { reviews, ...clubWithoutReviews } = club

      return {
        ...clubWithoutReviews,
        averageRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
        distance:
          query.lat !== undefined && query.lng !== undefined
            ? Math.round(calculateDistance(query.lat, query.lng, club.latitude, club.longitude) * 10) / 10
            : null,
      }
    })

    // Sort by distance if requested
    if (query.sortBy === 'distance' && query.lat !== undefined && query.lng !== undefined) {
      processedClubs = processedClubs
        .filter((club) => club.distance !== null && club.distance <= query.radius)
        .sort((a, b) => {
          const distA = a.distance ?? Infinity
          const distB = b.distance ?? Infinity
          return query.sortOrder === 'asc' ? distA - distB : distB - distA
        })
        .slice(skip, skip + query.limit)
    }

    return NextResponse.json({
      data: processedClubs,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    })
  } catch (error) {
    console.error('Error listing clubs:', error)
    return NextResponse.json(
      { error: 'Failed to list clubs' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/clubs
 * Create a new club (requires authentication)
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
    const validationResult = createClubSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Generate slug from name
    const baseSlug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Ensure unique slug
    let slug = baseSlug
    let counter = 1
    while (await prisma.club.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create club with owner membership
    const club = await prisma.club.create({
      data: {
        ...data,
        slug,
        members: {
          create: {
            userId: currentUser.db.id,
            role: ClubRole.OWNER,
          },
        },
      },
      include: {
        members: {
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
        },
        _count: {
          select: { members: true },
        },
      },
    })

    return NextResponse.json(
      { data: club, message: 'Club created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating club:', error)
    return NextResponse.json(
      { error: 'Failed to create club' },
      { status: 500 }
    )
  }
}
