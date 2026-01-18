import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

type RouteContext = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/messages/conversations/[id]
 * Get messages in a conversation
 * Note: id is the other user's ID (conversation partner)
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await requireAuth()
    const { id: partnerId } = await context.params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50', 10), 100)

    // Verify the partner exists
    const partner = await prisma.user.findUnique({
      where: { id: partnerId },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
      },
    })

    if (!partner) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get messages between the two users
    const where = {
      OR: [
        { senderId: user.id, receiverId: partnerId },
        { senderId: partnerId, receiverId: user.id },
      ],
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
            },
          },
        },
      }),
      prisma.message.count({ where }),
    ])

    // Mark unread messages from partner as read
    await prisma.message.updateMany({
      where: {
        senderId: partnerId,
        receiverId: user.id,
        isRead: false,
      },
      data: { isRead: true },
    })

    return NextResponse.json({
      partner,
      messages: messages.map((m) => ({
        id: m.id,
        content: m.content,
        createdAt: m.createdAt,
        isRead: m.isRead,
        isSentByMe: m.senderId === user.id,
        sender: m.sender,
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message === 'User not found in database') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
