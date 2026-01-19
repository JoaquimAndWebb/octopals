import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const sendMessageSchema = z.object({
  receiverId: z.string().cuid('Invalid receiver ID'),
  content: z.string().min(1, 'Message cannot be empty').max(5000, 'Message too long'),
})

/**
 * GET /api/messages
 * Get user's conversations (grouped by other user)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '20', 10), 50)

    // Get all messages where user is sender or receiver (direct messages only)
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.id, receiverId: { not: null } },
          { receiverId: user.id },
        ],
      },
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
        receiver: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Group messages by conversation partner
    const conversationsMap = new Map<
      string,
      {
        partnerId: string
        partner: {
          id: string
          username: string | null
          firstName: string | null
          lastName: string | null
          imageUrl: string | null
        }
        lastMessage: typeof messages[0]
        unreadCount: number
      }
    >()

    for (const message of messages) {
      const partnerId = message.senderId === user.id ? message.receiverId! : message.senderId
      const partner = message.senderId === user.id ? message.receiver! : message.sender

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partnerId,
          partner,
          lastMessage: message,
          unreadCount: 0,
        })
      }

      // Count unread messages from partner
      if (message.receiverId === user.id && !message.isRead) {
        const conv = conversationsMap.get(partnerId)!
        conv.unreadCount++
      }
    }

    // Convert to array and paginate
    const conversations = Array.from(conversationsMap.values())
    const total = conversations.length
    const paginatedConversations = conversations.slice(
      (page - 1) * pageSize,
      page * pageSize
    )

    return NextResponse.json({
      conversations: paginatedConversations.map((conv) => ({
        partnerId: conv.partnerId,
        partner: conv.partner,
        lastMessage: {
          id: conv.lastMessage.id,
          content: conv.lastMessage.content,
          createdAt: conv.lastMessage.createdAt,
          isRead: conv.lastMessage.isRead,
          isSentByMe: conv.lastMessage.senderId === user.id,
        },
        unreadCount: conv.unreadCount,
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
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/messages
 * Send a new message
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    // Validate input
    const validatedData = sendMessageSchema.parse(body)

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: validatedData.receiverId },
    })

    if (!receiver) {
      return NextResponse.json(
        { error: 'Receiver not found' },
        { status: 404 }
      )
    }

    // Prevent sending message to self
    if (receiver.id === user.id) {
      return NextResponse.json(
        { error: 'Cannot send message to yourself' },
        { status: 400 }
      )
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId: validatedData.receiverId,
        content: validatedData.content,
      },
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
        receiver: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
      },
    })

    // Optionally create a notification for the receiver
    await prisma.notification.create({
      data: {
        userId: validatedData.receiverId,
        type: 'MESSAGE',
        title: 'New Message',
        body: `${user.firstName || user.username || 'Someone'} sent you a message`,
        linkUrl: `/messages/${user.id}`,
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message === 'User not found in database') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      )
    }
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
