import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

type RouteContext = {
  params: Promise<{ id: string }>
}

/**
 * PATCH /api/notifications/[id]/read
 * Mark a notification as read
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await requireAuth()
    const { id: notificationId } = await context.params

    // Find the notification
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (notification.userId !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to modify this notification' },
        { status: 403 }
      )
    }

    // Update the notification
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    })

    return NextResponse.json(updatedNotification)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message === 'User not found in database') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.error('Error marking notification as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    )
  }
}
