import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

/**
 * POST /api/notifications/read-all
 * Mark all notifications as read
 */
export async function POST() {
  try {
    const user = await requireAuth()

    // Mark all unread notifications as read
    const result = await prisma.notification.updateMany({
      where: {
        userId: user.id,
        isRead: false,
      },
      data: { isRead: true },
    })

    return NextResponse.json({
      success: true,
      markedAsRead: result.count,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message === 'User not found in database') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.error('Error marking all notifications as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark all notifications as read' },
      { status: 500 }
    )
  }
}
