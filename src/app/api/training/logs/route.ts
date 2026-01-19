import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { trainingLogSchema, trainingFiltersSchema } from '@/lib/validations/training'

/**
 * GET /api/training/logs
 * Get user's training logs with optional date filters
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)

    // Parse and validate filters
    const filters = trainingFiltersSchema.parse({
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

    // Fetch logs with pagination
    const [logs, total] = await Promise.all([
      prisma.trainingLog.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      prisma.trainingLog.count({ where }),
    ])

    return NextResponse.json({
      logs,
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
    console.error('Error fetching training logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch training logs' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/training/logs
 * Create a new training log
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    // Validate input
    const validatedData = trainingLogSchema.parse(body)

    // Create training log
    const log = await prisma.trainingLog.create({
      data: {
        userId: user.id,
        date: validatedData.date,
        type: validatedData.type,
        durationMins: validatedData.durationMins,
        intensity: validatedData.intensity,
        notes: validatedData.notes,
      },
    })

    return NextResponse.json(log, { status: 201 })
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
    console.error('Error creating training log:', error)
    return NextResponse.json(
      { error: 'Failed to create training log' },
      { status: 500 }
    )
  }
}
