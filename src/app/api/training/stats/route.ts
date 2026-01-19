import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

/**
 * GET /api/training/stats
 * Get training statistics (totals, averages)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)

    // Optional date range filter
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build date filter
    const dateFilter: { gte?: Date; lte?: Date } = {}
    if (startDate) {
      dateFilter.gte = new Date(startDate)
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate)
    }

    const trainingWhere = {
      userId: user.id,
      ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
    }

    // Fetch training log stats
    const [
      trainingLogsAggregation,
      trainingLogsByType,
      breathHoldsAggregation,
      totalTrainingSessions,
      totalBreathHolds,
    ] = await Promise.all([
      // Overall training stats
      prisma.trainingLog.aggregate({
        where: trainingWhere,
        _sum: { durationMins: true },
        _avg: { durationMins: true, intensity: true },
        _count: true,
      }),
      // Training logs grouped by type
      prisma.trainingLog.groupBy({
        by: ['type'],
        where: trainingWhere,
        _sum: { durationMins: true },
        _avg: { intensity: true },
        _count: true,
      }),
      // Overall breath hold stats
      prisma.breathHoldRecord.aggregate({
        where: trainingWhere,
        _max: { durationSeconds: true },
        _avg: { durationSeconds: true, difficulty: true },
        _count: true,
      }),
      // Total training sessions count
      prisma.trainingLog.count({ where: trainingWhere }),
      // Total breath holds count
      prisma.breathHoldRecord.count({ where: trainingWhere }),
    ])

    // Calculate streaks (consecutive training days)
    const recentTrainingDays = await prisma.trainingLog.findMany({
      where: { userId: user.id },
      select: { date: true },
      orderBy: { date: 'desc' },
      distinct: ['date'],
      take: 365, // Last year of unique training days
    })

    // Calculate current streak
    let currentStreak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < recentTrainingDays.length; i++) {
      const trainingDate = new Date(recentTrainingDays[i].date)
      trainingDate.setHours(0, 0, 0, 0)

      const expectedDate = new Date(today)
      expectedDate.setDate(expectedDate.getDate() - i)

      if (trainingDate.getTime() === expectedDate.getTime()) {
        currentStreak++
      } else if (i === 0 && trainingDate.getTime() === expectedDate.getTime() - 86400000) {
        // Allow for yesterday if no training today yet
        const yesterdayExpected = new Date(today)
        yesterdayExpected.setDate(yesterdayExpected.getDate() - 1)
        if (trainingDate.getTime() === yesterdayExpected.getTime()) {
          currentStreak++
        } else {
          break
        }
      } else {
        break
      }
    }

    return NextResponse.json({
      training: {
        totalSessions: totalTrainingSessions,
        totalMinutes: trainingLogsAggregation._sum.durationMins || 0,
        totalHours: Math.round((trainingLogsAggregation._sum.durationMins || 0) / 60 * 10) / 10,
        averageSessionMinutes: Math.round((trainingLogsAggregation._avg.durationMins || 0) * 10) / 10,
        averageIntensity: Math.round((trainingLogsAggregation._avg.intensity || 0) * 10) / 10,
        byType: trainingLogsByType.map((t) => ({
          type: t.type,
          count: t._count,
          totalMinutes: t._sum.durationMins || 0,
          averageIntensity: Math.round((t._avg.intensity || 0) * 10) / 10,
        })),
        currentStreak,
      },
      breathHolds: {
        totalRecords: totalBreathHolds,
        longestHoldSeconds: breathHoldsAggregation._max.durationSeconds || 0,
        averageHoldSeconds: Math.round((breathHoldsAggregation._avg.durationSeconds || 0) * 10) / 10,
        averageDifficulty: Math.round((breathHoldsAggregation._avg.difficulty || 0) * 10) / 10,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message === 'User not found in database') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.error('Error fetching training stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch training stats' },
      { status: 500 }
    )
  }
}
