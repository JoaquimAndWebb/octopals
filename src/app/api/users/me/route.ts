import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { updateProfileSchema } from '@/lib/validations/user'

/**
 * GET /api/users/me
 * Get current user's profile from database
 */
export async function GET() {
  try {
    const user = await requireAuth()

    const userWithRelations = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        clubMemberships: {
          where: { isActive: true },
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
        },
        _count: {
          select: {
            badges: true,
            trainingLogs: true,
            favoriteClubs: true,
          },
        },
      },
    })

    if (!userWithRelations) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: userWithRelations })
  } catch (error) {
    console.error('Error getting current user:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to get user profile' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/users/me
 * Update current user's profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const validationResult = updateProfileSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check if username is being updated and is unique
    if (data.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: data.username,
          NOT: { id: user.id },
        },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 409 }
        )
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data,
      include: {
        clubMemberships: {
          where: { isActive: true },
          include: {
            club: {
              select: {
                id: true,
                name: true,
                slug: true,
                imageUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            badges: true,
            trainingLogs: true,
            favoriteClubs: true,
          },
        },
      },
    })

    return NextResponse.json({
      data: updatedUser,
      message: 'Profile updated successfully',
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
