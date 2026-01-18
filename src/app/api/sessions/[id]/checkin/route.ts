import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { checkinSchema } from '@/lib/validations/session'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/sessions/[id]/checkin
 * Check in to a session (creates Attendance record)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: sessionId } = await params

    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get current user from database
    const currentUser = await getCurrentUser()
    if (!currentUser?.db) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = checkinSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check if session exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        title: true,
        startTime: true,
        endTime: true,
        isCancelled: true,
        venue: {
          select: {
            latitude: true,
            longitude: true,
          },
        },
      },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    if (session.isCancelled) {
      return NextResponse.json(
        { error: 'Cannot check in to a cancelled session' },
        { status: 400 }
      )
    }

    // Check if session is within a reasonable time window
    // Allow check-in from 30 minutes before start to 30 minutes after end
    const now = new Date()
    const checkInWindowStart = new Date(session.startTime.getTime() - 30 * 60 * 1000)
    const checkInWindowEnd = new Date(session.endTime.getTime() + 30 * 60 * 1000)

    if (now < checkInWindowStart) {
      return NextResponse.json(
        { error: 'Check-in is not open yet. Check-in opens 30 minutes before the session.' },
        { status: 400 }
      )
    }

    if (now > checkInWindowEnd) {
      return NextResponse.json(
        { error: 'Check-in window has closed' },
        { status: 400 }
      )
    }

    // Check if already checked in
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        sessionId_userId: {
          sessionId,
          userId: currentUser.db.id,
        },
      },
    })

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Already checked in to this session' },
        { status: 400 }
      )
    }

    // If GPS check-in, verify location (optional validation)
    if (data.method === 'GPS' && data.latitude && data.longitude && session.venue) {
      const distance = calculateDistance(
        data.latitude,
        data.longitude,
        session.venue.latitude,
        session.venue.longitude
      )

      // Allow check-in within 500 meters of venue
      if (distance > 0.5) {
        return NextResponse.json(
          { error: 'You are too far from the venue for GPS check-in' },
          { status: 400 }
        )
      }
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        sessionId,
        userId: currentUser.db.id,
        method: data.method,
      },
      include: {
        session: {
          select: {
            id: true,
            title: true,
            startTime: true,
            club: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      data: attendance,
      message: 'Checked in successfully',
    })
  } catch (error) {
    console.error('Error checking in:', error)
    return NextResponse.json(
      { error: 'Failed to check in' },
      { status: 500 }
    )
  }
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}
