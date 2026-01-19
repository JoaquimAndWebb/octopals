import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ClubRole } from '@prisma/client'

type RouteParams = { params: Promise<{ id: string }> }

/**
 * POST /api/clubs/[id]/join
 * Join a club (adds user as MEMBER)
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

    // Verify club exists and is active
    const club = await prisma.club.findUnique({
      where: { id },
      select: { id: true, name: true, isActive: true },
    })

    if (!club) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      )
    }

    if (!club.isActive) {
      return NextResponse.json(
        { error: 'This club is not accepting new members' },
        { status: 400 }
      )
    }

    // Check if already a member
    const existingMembership = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: currentUser.id,
          clubId: id,
        },
      },
    })

    if (existingMembership) {
      if (existingMembership.isActive) {
        return NextResponse.json(
          { error: 'You are already a member of this club' },
          { status: 400 }
        )
      }

      // Reactivate inactive membership
      const reactivatedMember = await prisma.clubMember.update({
        where: { id: existingMembership.id },
        data: { isActive: true },
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
              slug: true,
            },
          },
        },
      })

      return NextResponse.json({
        data: reactivatedMember,
        message: `Successfully rejoined ${club.name}`,
      })
    }

    // Create new membership
    const newMember = await prisma.clubMember.create({
      data: {
        userId: currentUser.id,
        clubId: id,
        role: ClubRole.MEMBER,
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
            slug: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        data: newMember,
        message: `Successfully joined ${club.name}`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error joining club:', error)
    return NextResponse.json(
      { error: 'Failed to join club' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/clubs/[id]/join
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
