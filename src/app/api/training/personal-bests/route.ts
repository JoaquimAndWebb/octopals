import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

/**
 * GET /api/training/personal-bests
 * Get personal bests for breath holds
 */
export async function GET() {
  try {
    const user = await requireAuth()

    // Get personal bests for each type of breath hold
    const [staticPB, co2TablePB, o2TablePB, freePB, overallPB] = await Promise.all([
      // Static breath hold PB
      prisma.breathHoldRecord.findFirst({
        where: { userId: user.id, type: 'STATIC' },
        orderBy: { durationSeconds: 'desc' },
      }),
      // CO2 Table PB
      prisma.breathHoldRecord.findFirst({
        where: { userId: user.id, type: 'CO2_TABLE' },
        orderBy: { durationSeconds: 'desc' },
      }),
      // O2 Table PB
      prisma.breathHoldRecord.findFirst({
        where: { userId: user.id, type: 'O2_TABLE' },
        orderBy: { durationSeconds: 'desc' },
      }),
      // Free breath hold PB
      prisma.breathHoldRecord.findFirst({
        where: { userId: user.id, type: 'FREE' },
        orderBy: { durationSeconds: 'desc' },
      }),
      // Overall PB (any type)
      prisma.breathHoldRecord.findFirst({
        where: { userId: user.id },
        orderBy: { durationSeconds: 'desc' },
      }),
    ])

    // Get recent progression (last 10 PBs achieved)
    const recentPBs = await prisma.$queryRaw<
      Array<{
        id: string
        date: Date
        durationSeconds: number
        type: string
      }>
    >`
      WITH ranked_holds AS (
        SELECT
          id,
          date,
          "durationSeconds",
          type,
          ROW_NUMBER() OVER (
            PARTITION BY type
            ORDER BY "durationSeconds" DESC, date ASC
          ) as rn
        FROM "BreathHoldRecord"
        WHERE "userId" = ${user.id}
      )
      SELECT id, date, "durationSeconds", type
      FROM ranked_holds
      WHERE rn = 1
      ORDER BY date DESC
      LIMIT 10
    `

    // Format the response
    const formatPB = (record: typeof staticPB) => {
      if (!record) return null
      return {
        id: record.id,
        durationSeconds: record.durationSeconds,
        date: record.date,
        formattedDuration: formatDuration(record.durationSeconds),
      }
    }

    return NextResponse.json({
      overall: formatPB(overallPB),
      byType: {
        STATIC: formatPB(staticPB),
        CO2_TABLE: formatPB(co2TablePB),
        O2_TABLE: formatPB(o2TablePB),
        FREE: formatPB(freePB),
      },
      recentAchievements: recentPBs.map((pb) => ({
        ...pb,
        formattedDuration: formatDuration(pb.durationSeconds),
      })),
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message === 'User not found in database') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.error('Error fetching personal bests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch personal bests' },
      { status: 500 }
    )
  }
}

/**
 * Format duration in seconds to mm:ss format
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
