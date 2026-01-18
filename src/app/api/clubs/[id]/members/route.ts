import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ClubRole } from '@prisma/client'

type RouteParams = { params: Promise<{ id: string }> }

// Query params schema for GET
const listMembersQuerySchema = z.object({
  role: z.nativeEnum(ClubRole).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

// Schema for adding a member (admin operation)
const addMemberSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  role: z.nativeEnum(ClubRole).default(ClubRole.MEMBER),
})

/**
 * GET /api/clubs/[id]/members
 * List club members with roles
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)

    // Verify club exists
    const club = await prisma.club.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!club) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      )
    }

    // Parse query parameters
    const queryResult = listMembersQuerySchema.safeParse({
      role: searchParams.get('role') || undefined,
      search: searchParams.get('search') || undefined,
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
    const where: any = {
      clubId: id,
      isActive: true,
    }

    if (query.role) {
      where.role = query.role
    }

    // Search by user name
    if (query.search) {
      where.user = {
        OR: [
          { username: { contains: query.search, mode: 'insensitive' } },
          { firstName: { contains: query.search, mode: 'insensitive' } },
          { lastName: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } },
        ],
      }
    }

    // Execute query
    const [members, total] = await Promise.all([
      prisma.clubMember.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: [
          { role: 'asc' }, // Owners first, then admins, etc.
          { joinedAt: 'asc' },
        ],
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
              skillLevel: true,
              primaryPosition: true,
              country: true,
              location: true,
            },
          },
        },
      }),
      prisma.clubMember.count({ where }),
    ])

    // Transform response
    const transformedMembers = members.map((member) => ({
      id: member.id,
      role: member.role,
      joinedAt: member.joinedAt,
      isActive: member.isActive,
      user: member.user,
    }))

    return NextResponse.json({
      data: transformedMembers,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    })
  } catch (error) {
    console.error('Error listing club members:', error)
    return NextResponse.json(
      { error: 'Failed to list club members' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/clubs/[id]/members
 * Add a member or request to join (admin can add, users can request)
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get current user from database
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    // Verify club exists
    const club = await prisma.club.findUnique({
      where: { id },
      select: { id: true, name: true },
    })

    if (!club) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      )
    }

    // Check if current user is an admin
    const adminMembership = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: currentUser.id,
          clubId: id,
        },
      },
    })

    const adminRoles: ClubRole[] = [ClubRole.ADMIN, ClubRole.OWNER]
    const isAdmin = adminMembership && adminRoles.includes(adminMembership.role)

    // Parse request body
    const body = await request.json()

    if (isAdmin) {
      // Admin adding a member
      const validationResult = addMemberSchema.safeParse(body)

      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Invalid request data', details: validationResult.error.flatten() },
          { status: 400 }
        )
      }

      const data = validationResult.data

      // Check if user exists
      const targetUser = await prisma.user.findUnique({
        where: { id: data.userId },
      })

      if (!targetUser) {
        return NextResponse.json(
          { error: 'Target user not found' },
          { status: 404 }
        )
      }

      // Check if already a member
      const existingMembership = await prisma.clubMember.findUnique({
        where: {
          userId_clubId: {
            userId: data.userId,
            clubId: id,
          },
        },
      })

      if (existingMembership) {
        // Update role if exists
        const updatedMember = await prisma.clubMember.update({
          where: { id: existingMembership.id },
          data: {
            role: data.role,
            isActive: true,
          },
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
        })

        return NextResponse.json({
          data: updatedMember,
          message: 'Member role updated successfully',
        })
      }

      // Create new membership
      const newMember = await prisma.clubMember.create({
        data: {
          userId: data.userId,
          clubId: id,
          role: data.role,
        },
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
      })

      return NextResponse.json(
        { data: newMember, message: 'Member added successfully' },
        { status: 201 }
      )
    } else {
      // Non-admin requesting to join (or adding themselves)
      // Check if already a member
      const existingMembership = await prisma.clubMember.findUnique({
        where: {
          userId_clubId: {
            userId: currentUser.id,
            clubId: id,
          },
        },
      })

      if (existingMembership) {
        if (existingMembership.isActive) {
          return NextResponse.json(
            { error: 'You are already a member of this club' },
            { status: 400 }
          )
        }

        // Reactivate membership
        const reactivatedMember = await prisma.clubMember.update({
          where: { id: existingMembership.id },
          data: { isActive: true },
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
        })

        return NextResponse.json({
          data: reactivatedMember,
          message: 'Successfully rejoined the club',
        })
      }

      // Create membership as regular member
      const newMember = await prisma.clubMember.create({
        data: {
          userId: currentUser.id,
          clubId: id,
          role: ClubRole.MEMBER,
        },
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
      })

      return NextResponse.json(
        { data: newMember, message: 'Successfully joined the club' },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Error adding club member:', error)
    return NextResponse.json(
      { error: 'Failed to add club member' },
      { status: 500 }
    )
  }
}
