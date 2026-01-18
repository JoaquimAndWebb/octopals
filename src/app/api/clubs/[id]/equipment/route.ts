import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { createEquipmentSchema } from '@/lib/validations/equipment'
import { EquipmentType, EquipmentCondition, EquipmentSize, ClubRole } from '@prisma/client'

interface RouteParams {
  params: Promise<{ id: string }>
}

// Query params schema for GET
const listEquipmentQuerySchema = z.object({
  type: z.nativeEnum(EquipmentType).optional(),
  size: z.nativeEnum(EquipmentSize).optional(),
  condition: z.nativeEnum(EquipmentCondition).optional(),
  isAvailable: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

/**
 * GET /api/clubs/[id]/equipment
 * List club's equipment with filters
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: clubId } = await params
    const { searchParams } = new URL(request.url)

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { id: true },
    })

    if (!club) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      )
    }

    // Parse query parameters
    const queryResult = listEquipmentQuerySchema.safeParse({
      type: searchParams.get('type') || undefined,
      size: searchParams.get('size') || undefined,
      condition: searchParams.get('condition') || undefined,
      isAvailable: searchParams.get('isAvailable') || undefined,
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

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { clubId }

    if (query.type) {
      where.type = query.type
    }
    if (query.size) {
      where.size = query.size
    }
    if (query.condition) {
      where.condition = query.condition
    }
    if (query.isAvailable !== undefined) {
      where.isAvailable = query.isAvailable
    }

    // Execute query
    const [equipment, total] = await Promise.all([
      prisma.equipment.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: [
          { type: 'asc' },
          { name: 'asc' },
        ],
        include: {
          checkouts: {
            where: { returnedAt: null },
            take: 1,
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      }),
      prisma.equipment.count({ where }),
    ])

    // Add current checkout info
    const equipmentWithCheckout = equipment.map((item) => {
      const currentCheckout = item.checkouts[0] || null
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { checkouts, ...rest } = item
      return {
        ...rest,
        currentCheckout: currentCheckout
          ? {
              checkedOutAt: currentCheckout.checkedOutAt,
              dueDate: currentCheckout.dueDate,
              user: currentCheckout.user,
            }
          : null,
      }
    })

    return NextResponse.json({
      data: equipmentWithCheckout,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    })
  } catch (error) {
    console.error('Error listing equipment:', error)
    return NextResponse.json(
      { error: 'Failed to list equipment' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/clubs/[id]/equipment
 * Add equipment to club (requires club admin)
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: clubId } = await params

    // Check if user is authenticated
    let user
    try {
      user = await requireAuth()
    } catch {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { id: true },
    })

    if (!club) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      )
    }

    // Check if user has permission (admin, owner, or equipment manager)
    const membership = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId,
        },
      },
    })

    const allowedRoles: ClubRole[] = [
      ClubRole.ADMIN,
      ClubRole.OWNER,
      ClubRole.EQUIPMENT_MANAGER,
    ]

    if (!membership || !allowedRoles.includes(membership.role)) {
      return NextResponse.json(
        { error: 'You do not have permission to add equipment' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = createEquipmentSchema.omit({ clubId: true }).safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Create equipment
    const equipment = await prisma.equipment.create({
      data: {
        ...data,
        clubId,
      },
    })

    return NextResponse.json(
      { data: equipment, message: 'Equipment added successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error adding equipment:', error)
    return NextResponse.json(
      { error: 'Failed to add equipment' },
      { status: 500 }
    )
  }
}
