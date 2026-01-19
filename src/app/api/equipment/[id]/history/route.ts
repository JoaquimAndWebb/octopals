import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

// Query params schema
const historyQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

/**
 * GET /api/equipment/[id]/history
 * Get checkout history for equipment
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: equipmentId } = await params
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const queryResult = historyQuerySchema.safeParse({
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    })

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryResult.error.flatten() },
        { status: 400 }
      )
    }

    const query = queryResult.data
    const skip = (query.page - 1) * query.limit

    // Check if equipment exists
    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
      select: {
        id: true,
        name: true,
        type: true,
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      )
    }

    // Get checkout history
    const [checkouts, total] = await Promise.all([
      prisma.equipmentCheckout.findMany({
        where: { equipmentId },
        skip,
        take: query.limit,
        orderBy: { checkedOutAt: 'desc' },
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
        },
      }),
      prisma.equipmentCheckout.count({
        where: { equipmentId },
      }),
    ])

    // Calculate statistics
    const stats = await prisma.equipmentCheckout.aggregate({
      where: { equipmentId },
      _count: { id: true },
    })

    const completedCheckouts = await prisma.equipmentCheckout.count({
      where: {
        equipmentId,
        returnedAt: { not: null },
      },
    })

    const overdueCheckouts = await prisma.equipmentCheckout.count({
      where: {
        equipmentId,
        returnedAt: null,
        dueDate: { lt: new Date() },
      },
    })

    return NextResponse.json({
      data: {
        equipment,
        checkouts,
        stats: {
          totalCheckouts: stats._count.id,
          completedCheckouts,
          overdueCheckouts,
          currentlyCheckedOut: stats._count.id - completedCheckouts,
        },
      },
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    })
  } catch (error) {
    console.error('Error getting equipment history:', error)
    return NextResponse.json(
      { error: 'Failed to get equipment history' },
      { status: 500 }
    )
  }
}
