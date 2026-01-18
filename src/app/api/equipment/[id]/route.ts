import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { updateEquipmentSchema } from '@/lib/validations/equipment'
import { ClubRole } from '@prisma/client'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/equipment/[id]
 * Get single equipment item
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
          },
        },
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
                imageUrl: true,
              },
            },
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

    // Format response
    const currentCheckout = equipment.checkouts[0] || null
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { checkouts, ...rest } = equipment

    return NextResponse.json({
      data: {
        ...rest,
        currentCheckout: currentCheckout
          ? {
              id: currentCheckout.id,
              checkedOutAt: currentCheckout.checkedOutAt,
              dueDate: currentCheckout.dueDate,
              conditionOut: currentCheckout.conditionOut,
              user: currentCheckout.user,
            }
          : null,
      },
    })
  } catch (error) {
    console.error('Error getting equipment:', error)
    return NextResponse.json(
      { error: 'Failed to get equipment' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/equipment/[id]
 * Update equipment (requires club admin)
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    // Check authentication
    let user
    try {
      user = await requireAuth()
    } catch {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get equipment and check ownership
    const equipment = await prisma.equipment.findUnique({
      where: { id },
      select: { id: true, clubId: true },
    })

    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      )
    }

    // Check if user has permission
    const membership = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId: equipment.clubId,
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
        { error: 'You do not have permission to update this equipment' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = updateEquipmentSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Update equipment
    const updatedEquipment = await prisma.equipment.update({
      where: { id },
      data,
      include: {
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
      data: updatedEquipment,
      message: 'Equipment updated successfully',
    })
  } catch (error) {
    console.error('Error updating equipment:', error)
    return NextResponse.json(
      { error: 'Failed to update equipment' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/equipment/[id]
 * Delete equipment (requires club admin)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    // Check authentication
    let user
    try {
      user = await requireAuth()
    } catch {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get equipment and check ownership
    const equipment = await prisma.equipment.findUnique({
      where: { id },
      select: {
        id: true,
        clubId: true,
        checkouts: {
          where: { returnedAt: null },
          take: 1,
        },
      },
    })

    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      )
    }

    // Check if user has permission
    const membership = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId: equipment.clubId,
        },
      },
    })

    const allowedRoles: ClubRole[] = [
      ClubRole.ADMIN,
      ClubRole.OWNER,
    ]

    if (!membership || !allowedRoles.includes(membership.role)) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this equipment' },
        { status: 403 }
      )
    }

    // Check if equipment is currently checked out
    if (equipment.checkouts.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete equipment that is currently checked out' },
        { status: 400 }
      )
    }

    // Delete equipment
    await prisma.equipment.delete({
      where: { id },
    })

    return NextResponse.json({
      message: 'Equipment deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting equipment:', error)
    return NextResponse.json(
      { error: 'Failed to delete equipment' },
      { status: 500 }
    )
  }
}
