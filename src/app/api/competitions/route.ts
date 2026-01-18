import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SkillLevel } from '@prisma/client'

/**
 * GET /api/competitions
 * List competitions with filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse filters
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const country = searchParams.get('country')
    const skillLevel = searchParams.get('skillLevel') as SkillLevel | null
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '20', 10), 100)

    // Build where clause
    const where: {
      isPublished: boolean
      startDate?: { gte?: Date; lte?: Date }
      endDate?: { gte?: Date; lte?: Date }
      country?: string
      skillLevels?: { has: SkillLevel }
    } = {
      isPublished: true,
    }

    if (startDate) {
      where.startDate = { gte: new Date(startDate) }
    }

    if (endDate) {
      where.endDate = { lte: new Date(endDate) }
    }

    if (country) {
      where.country = country
    }

    if (skillLevel && Object.values(SkillLevel).includes(skillLevel)) {
      where.skillLevels = { has: skillLevel }
    }

    // Fetch competitions with pagination
    const [competitions, total] = await Promise.all([
      prisma.competition.findMany({
        where,
        orderBy: { startDate: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: {
            select: { followers: true },
          },
        },
      }),
      prisma.competition.count({ where }),
    ])

    return NextResponse.json({
      competitions: competitions.map((c) => ({
        ...c,
        followerCount: c._count.followers,
        _count: undefined,
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error('Error fetching competitions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitions' },
      { status: 500 }
    )
  }
}
