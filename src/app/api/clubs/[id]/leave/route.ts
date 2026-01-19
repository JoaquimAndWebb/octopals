import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ClubRole } from '@prisma/client'

type RouteParams = { params: Promise<{ id: string }> }

/**
 * DELETE /api/clubs/[id]/leave
 * Leave a club
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

    // Check if user is a member
    const membership = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: currentUser.id,
          clubId: id,
        },
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You are not a member of this club' },
        { status: 400 }
      )
    }

    if (!membership.isActive) {
      return NextResponse.json(
        { error: 'Your membership is already inactive' },
        { status: 400 }
      )
    }

    // Owners cannot leave - they must transfer ownership first
    if (membership.role === ClubRole.OWNER) {
      return NextResponse.json(
        { error: 'Club owners cannot leave. Please transfer ownership first or delete the club.' },
        { status: 400 }
      )
    }

    // Soft delete by setting isActive to false (preserves history)
    await prisma.clubMember.update({
      where: { id: membership.id },
      data: { isActive: false },
    })

    return NextResponse.json({
      message: `Successfully left ${membership.club.name}`,
    })
  } catch (error) {
    console.error('Error leaving club:', error)
    return NextResponse.json(
      { error: 'Failed to leave club' },
      { status: 500 }
    )
  }
}
