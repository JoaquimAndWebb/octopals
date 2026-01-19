import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/users/[id]
 * Get public user profile
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        bio: true,
        location: true,
        country: true,
        yearsPlaying: true,
        primaryPosition: true,
        skillLevel: true,
        isPublicProfile: true,
        createdAt: true,
        clubMemberships: {
          where: { isActive: true },
          select: {
            role: true,
            joinedAt: true,
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
        },
        badges: {
          select: {
            earnedAt: true,
            badge: {
              select: {
                id: true,
                name: true,
                description: true,
                imageUrl: true,
                category: true,
              },
            },
          },
          orderBy: { earnedAt: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            badges: true,
            trainingLogs: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // If profile is private, return limited info
    if (!user.isPublicProfile) {
      return NextResponse.json({
        data: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          imageUrl: user.imageUrl,
          isPublicProfile: false,
        },
      })
    }

    return NextResponse.json({ data: user })
  } catch (error) {
    console.error('Error getting user profile:', error)
    return NextResponse.json(
      { error: 'Failed to get user profile' },
      { status: 500 }
    )
  }
}
