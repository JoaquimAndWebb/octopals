import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ClubRole } from '@prisma/client'

/**
 * Get the current user from Clerk and database
 * Returns both Clerk user data and database user record
 */
export async function getCurrentUser() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    return null
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  })

  return {
    clerk: clerkUser,
    db: dbUser,
  }
}

/**
 * Require authentication - throws if not authenticated
 * Returns the current user if authenticated
 */
export async function requireAuth() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    throw new Error('User not found in database')
  }

  return user
}

/**
 * Verify user is an admin (ADMIN or OWNER) of a club
 * Throws if not authenticated or not an admin
 */
export async function requireClubAdmin(clubId: string) {
  const user = await requireAuth()

  const membership = await prisma.clubMember.findUnique({
    where: {
      userId_clubId: {
        userId: user.id,
        clubId: clubId,
      },
    },
  })

  if (!membership) {
    throw new Error('You are not a member of this club')
  }

  const adminRoles: ClubRole[] = [ClubRole.ADMIN, ClubRole.OWNER]

  if (!adminRoles.includes(membership.role)) {
    throw new Error('You do not have admin access to this club')
  }

  return {
    user,
    membership,
  }
}

/**
 * Verify user is a member of a club
 * Throws if not authenticated or not a member
 */
export async function requireClubMember(clubId: string) {
  const user = await requireAuth()

  const membership = await prisma.clubMember.findUnique({
    where: {
      userId_clubId: {
        userId: user.id,
        clubId: clubId,
      },
    },
  })

  if (!membership) {
    throw new Error('You are not a member of this club')
  }

  if (!membership.isActive) {
    throw new Error('Your membership is not active')
  }

  return {
    user,
    membership,
  }
}

/**
 * Check if user has a specific role or higher in a club
 */
export async function hasClubRole(clubId: string, requiredRoles: ClubRole[]) {
  try {
    const user = await requireAuth()

    const membership = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId: clubId,
        },
      },
    })

    if (!membership || !membership.isActive) {
      return false
    }

    return requiredRoles.includes(membership.role)
  } catch {
    return false
  }
}
