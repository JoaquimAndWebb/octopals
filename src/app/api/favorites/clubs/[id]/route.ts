import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/favorites/clubs/[id]
 * Add club to favorites
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: clubId } = await params

    // Check authentication
    let user
    try {
      user = await requireAuth()
    } catch {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        city: true,
        country: true,
      },
    })

    if (!club) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      )
    }

    // Check if already favorited
    const existing = await prisma.favoriteClub.findUnique({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Club is already in favorites' },
        { status: 409 }
      )
    }

    // Create favorite
    const favorite = await prisma.favoriteClub.create({
      data: {
        userId: user.id,
        clubId,
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            city: true,
            country: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        data: {
          ...favorite.club,
          favoritedAt: favorite.createdAt,
        },
        message: 'Club added to favorites',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Failed to add club to favorites' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/favorites/clubs/[id]
 * Remove club from favorites
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: clubId } = await params

    // Check authentication
    let user
    try {
      user = await requireAuth()
    } catch {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if favorite exists
    const favorite = await prisma.favoriteClub.findUnique({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId,
        },
      },
    })

    if (!favorite) {
      return NextResponse.json(
        { error: 'Club is not in favorites' },
        { status: 404 }
      )
    }

    // Delete favorite
    await prisma.favoriteClub.delete({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId,
        },
      },
    })

    return NextResponse.json({
      message: 'Club removed from favorites',
    })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: 'Failed to remove club from favorites' },
      { status: 500 }
    )
  }
}
