import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getBoundingBox, calculateDistance } from '@/lib/geo'

// Query params schema
const nearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().positive().max(500).default(50), // km, max 500km
  welcomesBeginners: z.coerce.boolean().optional(),
  isVerified: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

/**
 * GET /api/clubs/nearby
 * Geospatial search for clubs near lat/lng within radius
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const queryResult = nearbyQuerySchema.safeParse({
      lat: searchParams.get('lat'),
      lng: searchParams.get('lng'),
      radius: searchParams.get('radius') || undefined,
      welcomesBeginners: searchParams.get('welcomesBeginners') || undefined,
      isVerified: searchParams.get('isVerified') || undefined,
      limit: searchParams.get('limit') || undefined,
    })

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryResult.error.flatten() },
        { status: 400 }
      )
    }

    const query = queryResult.data

    // Calculate bounding box for initial filter
    const boundingBox = getBoundingBox(query.lat, query.lng, query.radius)

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      isActive: true,
      latitude: { gte: boundingBox.minLat, lte: boundingBox.maxLat },
      longitude: { gte: boundingBox.minLng, lte: boundingBox.maxLng },
    }

    if (query.welcomesBeginners !== undefined) {
      where.welcomesBeginners = query.welcomesBeginners
    }
    if (query.isVerified !== undefined) {
      where.isVerified = query.isVerified
    }

    // Fetch clubs within bounding box
    const clubs = await prisma.club.findMany({
      where,
      include: {
        _count: {
          select: { members: true, sessions: true, reviews: true },
        },
        reviews: {
          select: { rating: true },
        },
        sessions: {
          where: {
            startTime: { gte: new Date() },
            isCancelled: false,
          },
          orderBy: { startTime: 'asc' },
          take: 1,
          select: {
            id: true,
            title: true,
            startTime: true,
          },
        },
      },
    })

    // Calculate exact distances and filter
    const clubsWithDistance = clubs
      .map((club) => {
        const distance = calculateDistance(
          query.lat,
          query.lng,
          club.latitude,
          club.longitude
        )

        // Calculate average rating
        const avgRating =
          club.reviews.length > 0
            ? club.reviews.reduce((sum, r) => sum + r.rating, 0) / club.reviews.length
            : null

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { reviews, ...clubWithoutReviews } = club

        return {
          ...clubWithoutReviews,
          distance: Math.round(distance * 10) / 10, // Round to 1 decimal
          averageRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
          nextSession: club.sessions[0] || null,
        }
      })
      .filter((club) => club.distance <= query.radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, query.limit)

    return NextResponse.json({
      data: clubsWithDistance,
      searchParams: {
        lat: query.lat,
        lng: query.lng,
        radius: query.radius,
      },
      count: clubsWithDistance.length,
    })
  } catch (error) {
    console.error('Error searching nearby clubs:', error)
    return NextResponse.json(
      { error: 'Failed to search nearby clubs' },
      { status: 500 }
    )
  }
}
