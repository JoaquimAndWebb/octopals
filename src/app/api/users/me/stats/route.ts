import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

/**
 * GET /api/users/me/stats
 * Get user statistics (sessions attended, training logs count, etc.)
 */
export async function GET() {
  try {
    const user = await requireAuth()

    // Get various statistics in parallel
    const [
      sessionsAttended,
      trainingLogsCount,
      totalTrainingMinutes,
      badgesCount,
      clubsCount,
      breathHoldRecords,
      equipmentCheckouts,
      reviewsWritten,
    ] = await Promise.all([
      // Sessions attended (via Attendance)
      prisma.attendance.count({
        where: { userId: user.id },
      }),

      // Training logs
      prisma.trainingLog.count({
        where: { userId: user.id },
      }),

      // Total training minutes
      prisma.trainingLog.aggregate({
        where: { userId: user.id },
        _sum: { durationMins: true },
      }),

      // Badges earned
      prisma.userBadge.count({
        where: { userId: user.id },
      }),

      // Active club memberships
      prisma.clubMember.count({
        where: {
          userId: user.id,
          isActive: true,
        },
      }),

      // Breath hold records (best times)
      prisma.breathHoldRecord.findMany({
        where: { userId: user.id },
        orderBy: { durationSeconds: 'desc' },
        take: 1,
      }),

      // Equipment checkouts
      prisma.equipmentCheckout.count({
        where: { userId: user.id },
      }),

      // Reviews written
      prisma.review.count({
        where: { userId: user.id },
      }),
    ])

    // Get recent activity breakdown
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [recentSessions, recentTrainingLogs] = await Promise.all([
      prisma.attendance.count({
        where: {
          userId: user.id,
          checkedInAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.trainingLog.count({
        where: {
          userId: user.id,
          date: { gte: thirtyDaysAgo },
        },
      }),
    ])

    // Get training breakdown by type
    const trainingByType = await prisma.trainingLog.groupBy({
      by: ['type'],
      where: { userId: user.id },
      _count: { id: true },
      _sum: { durationMins: true },
    })

    const stats = {
      sessionsAttended,
      trainingLogsCount,
      totalTrainingMinutes: totalTrainingMinutes._sum.durationMins || 0,
      badgesCount,
      clubsCount,
      bestBreathHold: breathHoldRecords[0]?.durationSeconds || null,
      equipmentCheckouts,
      reviewsWritten,
      recent: {
        sessionsLast30Days: recentSessions,
        trainingLogsLast30Days: recentTrainingLogs,
      },
      trainingByType: trainingByType.map((t) => ({
        type: t.type,
        count: t._count.id,
        totalMinutes: t._sum.durationMins || 0,
      })),
    }

    return NextResponse.json({ data: stats })
  } catch (error) {
    console.error('Error getting user stats:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to get user stats' },
      { status: 500 }
    )
  }
}
