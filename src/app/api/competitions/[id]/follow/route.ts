import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

type RouteContext = {
  params: Promise<{ id: string }>
}

/**
 * POST /api/competitions/[id]/follow
 * Follow a competition
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await requireAuth()
    const { id: competitionId } = await context.params

    // Check if competition exists
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
    })

    if (!competition || !competition.isPublished) {
      return NextResponse.json(
        { error: 'Competition not found' },
        { status: 404 }
      )
    }

    // Check if already following
    const existingFollow = await prisma.competitionFollower.findUnique({
      where: {
        competitionId_userId: {
          competitionId,
          userId: user.id,
        },
      },
    })

    if (existingFollow) {
      return NextResponse.json(
        { error: 'Already following this competition' },
        { status: 400 }
      )
    }

    // Create follow
    const follow = await prisma.competitionFollower.create({
      data: {
        competitionId,
        userId: user.id,
      },
    })

    return NextResponse.json(follow, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message === 'User not found in database') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.error('Error following competition:', error)
    return NextResponse.json(
      { error: 'Failed to follow competition' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/competitions/[id]/follow
 * Unfollow a competition
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await requireAuth()
    const { id: competitionId } = await context.params

    // Check if following
    const existingFollow = await prisma.competitionFollower.findUnique({
      where: {
        competitionId_userId: {
          competitionId,
          userId: user.id,
        },
      },
    })

    if (!existingFollow) {
      return NextResponse.json(
        { error: 'Not following this competition' },
        { status: 400 }
      )
    }

    // Delete follow
    await prisma.competitionFollower.delete({
      where: {
        competitionId_userId: {
          competitionId,
          userId: user.id,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message === 'User not found in database') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.error('Error unfollowing competition:', error)
    return NextResponse.json(
      { error: 'Failed to unfollow competition' },
      { status: 500 }
    )
  }
}
