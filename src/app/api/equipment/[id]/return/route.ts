import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { returnEquipmentSchema } from '@/lib/validations/equipment'
import { ClubRole } from '@prisma/client'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/equipment/[id]/return
 * Return checked out equipment
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: equipmentId } = await params

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

    // Get equipment and current checkout
    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
      include: {
        club: {
          select: { id: true, name: true },
        },
        checkouts: {
          where: { returnedAt: null },
          take: 1,
          include: {
            user: {
              select: { id: true },
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

    const currentCheckout = equipment.checkouts[0]

    if (!currentCheckout) {
      return NextResponse.json(
        { error: 'Equipment is not currently checked out' },
        { status: 400 }
      )
    }

    // Check permission: either the user who checked it out or club admin
    const membership = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId: equipment.clubId,
        },
      },
    })

    const adminRoles: ClubRole[] = [
      ClubRole.ADMIN,
      ClubRole.OWNER,
      ClubRole.EQUIPMENT_MANAGER,
    ]

    const isCheckoutUser = currentCheckout.user.id === user.id
    const isAdmin = membership && adminRoles.includes(membership.role)

    if (!isCheckoutUser && !isAdmin) {
      return NextResponse.json(
        { error: 'You do not have permission to return this equipment' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const validationResult = returnEquipmentSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Update checkout record
    const updatedCheckout = await prisma.equipmentCheckout.update({
      where: { id: currentCheckout.id },
      data: {
        returnedAt: new Date(),
        conditionIn: data.conditionIn,
        photoInUrl: data.photoInUrl,
        notes: data.notes
          ? `${currentCheckout.notes || ''}\nReturn: ${data.notes}`.trim()
          : currentCheckout.notes,
      },
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Update equipment availability and condition
    await prisma.equipment.update({
      where: { id: equipmentId },
      data: {
        isAvailable: true,
        condition: data.conditionIn,
      },
    })

    return NextResponse.json({
      data: updatedCheckout,
      message: 'Equipment returned successfully',
    })
  } catch (error) {
    console.error('Error returning equipment:', error)
    return NextResponse.json(
      { error: 'Failed to return equipment' },
      { status: 500 }
    )
  }
}
