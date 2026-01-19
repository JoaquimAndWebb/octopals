import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { updateClubSchema } from '@/lib/validations/club'
import { ClubRole } from '@prisma/client'

type RouteParams = { params: Promise<{ id: string }> }

/**
 * GET /api/clubs/[id]
 * Get a single club with relations
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    const club = await prisma.club.findUnique({
      where: { id },
      include: {
        venues: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            country: true,
            latitude: true,
            longitude: true,
            poolLength: true,
            poolWidth: true,
            poolDepth: true,
            waterTemp: true,
            hasAccessibility: true,
            imageUrl: true,
          },
        },
        sessions: {
          where: {
            startTime: { gte: new Date() },
            isCancelled: false,
          },
          orderBy: { startTime: 'asc' },
          take: 5,
          select: {
            id: true,
            title: true,
            type: true,
            skillLevel: true,
            startTime: true,
            endTime: true,
            maxAttendees: true,
            venue: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
            _count: {
              select: { rsvps: true },
            },
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            content: true,
            createdAt: true,
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
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            members: true,
            sessions: true,
            reviews: true,
            equipment: true,
          },
        },
      },
    })

    if (!club) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const allReviews = await prisma.review.findMany({
      where: { clubId: id },
      select: { rating: true },
    })
    const averageRating =
      allReviews.length > 0
        ? Math.round(
            (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) * 10
          ) / 10
        : null

    return NextResponse.json({
      data: {
        ...club,
        averageRating,
      },
    })
  } catch (error) {
    console.error('Error fetching club:', error)
    return NextResponse.json(
      { error: 'Failed to fetch club' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/clubs/[id]
 * Update a club (requires club admin)
 */
export async function PATCH(
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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id },
    })

    if (!club) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      )
    }

    // Check if user is an admin of this club
    const membership = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId: id,
        },
      },
    })

    const adminRoles: ClubRole[] = [ClubRole.ADMIN, ClubRole.OWNER]
    if (!membership || !adminRoles.includes(membership.role)) {
      return NextResponse.json(
        { error: 'You do not have permission to update this club' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = updateClubSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Update slug if name changed
    let slug = club.slug
    if (data.name && data.name !== club.name) {
      const baseSlug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      slug = baseSlug
      let counter = 1
      while (true) {
        const existing = await prisma.club.findUnique({ where: { slug } })
        if (!existing || existing.id === id) break
        slug = `${baseSlug}-${counter}`
        counter++
      }
    }

    // Update club
    const updatedClub = await prisma.club.update({
      where: { id },
      data: {
        ...data,
        slug,
      },
      include: {
        _count: {
          select: { members: true, sessions: true, reviews: true },
        },
      },
    })

    return NextResponse.json({
      data: updatedClub,
      message: 'Club updated successfully',
    })
  } catch (error) {
    console.error('Error updating club:', error)
    return NextResponse.json(
      { error: 'Failed to update club' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/clubs/[id]
 * Delete a club (requires club owner)
 */
export async function DELETE(
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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id },
    })

    if (!club) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      )
    }

    // Check if user is the owner of this club
    const membership = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId: id,
        },
      },
    })

    if (!membership || membership.role !== ClubRole.OWNER) {
      return NextResponse.json(
        { error: 'Only the club owner can delete this club' },
        { status: 403 }
      )
    }

    // Delete club (cascades to members, sessions, etc.)
    await prisma.club.delete({
      where: { id },
    })

    return NextResponse.json({
      message: 'Club deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting club:', error)
    return NextResponse.json(
      { error: 'Failed to delete club' },
      { status: 500 }
    )
  }
}
