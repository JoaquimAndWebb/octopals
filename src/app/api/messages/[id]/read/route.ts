import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

type RouteContext = {
  params: Promise<{ id: string }>
}

/**
 * PATCH /api/messages/[id]/read
 * Mark a message as read
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await requireAuth()
    const { id: messageId } = await context.params

    // Find the message
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    // Only the receiver can mark a message as read
    if (message.receiverId !== user.id) {
      return NextResponse.json(
        { error: 'You can only mark messages sent to you as read' },
        { status: 403 }
      )
    }

    // Update the message
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    })

    return NextResponse.json(updatedMessage)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message === 'User not found in database') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.error('Error marking message as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark message as read' },
      { status: 500 }
    )
  }
}
