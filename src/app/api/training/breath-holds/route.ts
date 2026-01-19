import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { breathHoldSchema, breathHoldFiltersSchema } from '@/lib/validations/training'

/**
 * GET /api/training/breath-holds
 * Get user's breath hold records with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)

    // Parse and validate filters
    const filters = breathHoldFiltersSchema.parse({
      type: searchParams.get('type') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      page: searchParams.get('page') || '1',
      pageSize: searchParams.get('pageSize') || '20',
    })

    // Build where clause
    const where: {
      userId: string
      type?: string
      date?: { gte?: Date; lte?: Date }
    } = {
      userId: user.id,
    }

    if (filters.type) {
      where.type = filters.type
    }

    if (filters.startDate || filters.endDate) {
      where.date = {}
      if (filters.startDate) {
        where.date.gte = filters.startDate
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate
      }
    }

    // Fetch records with pagination
    const [records, total] = await Promise.all([
      prisma.breathHoldRecord.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      prisma.breathHoldRecord.count({ where }),
    ])

    return NextResponse.json({
      records,
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        total,
        totalPages: Math.ceil(total / filters.pageSize),
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message === 'User not found in database') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.error('Error fetching breath hold records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch breath hold records' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/training/breath-holds
 * Record a new breath hold
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    // Validate input
    const validatedData = breathHoldSchema.parse(body)

    // Create breath hold record
    const record = await prisma.breathHoldRecord.create({
      data: {
        userId: user.id,
        date: validatedData.date,
        durationSeconds: validatedData.durationSeconds,
        type: validatedData.type,
        tableRound: validatedData.tableRound,
        restSeconds: validatedData.restSeconds,
        heartRateBefore: validatedData.heartRateBefore,
        heartRateAfter: validatedData.heartRateAfter,
        difficulty: validatedData.difficulty,
        notes: validatedData.notes,
      },
    })

    return NextResponse.json(record, { status: 201 })
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
    console.error('Error recording breath hold:', error)
    return NextResponse.json(
      { error: 'Failed to record breath hold' },
      { status: 500 }
    )
  }
}
