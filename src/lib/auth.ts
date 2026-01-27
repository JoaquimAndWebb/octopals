import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ClubRole } from '@prisma/client'

/**
 * Sync user from Clerk to database
 * Creates the user if they don't exist, updates if they do
 */
async function syncUserFromClerk(clerkId: string) {
  const clerk = await clerkClient()
  const clerkUser = await clerk.users.getUser(clerkId)

  return prisma.user.upsert({
    where: { clerkId },
    update: {
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      username: clerkUser.username,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
    create: {
      clerkId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      username: clerkUser.username,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
  })
}

/**
 * Get the current user from Clerk and database
 * Returns both Clerk user data and database user record
 * Syncs user from Clerk to database if not found
 */
export async function getCurrentUser() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    return null
  }

  let dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  })

  if (!dbUser) {
    dbUser = await syncUserFromClerk(clerkUser.id)
  }

  return {
    clerk: clerkUser,
    db: dbUser,
  }
}

/**
 * Require authentication - throws if not authenticated
 * Returns the current user if authenticated
 * Syncs user from Clerk to database if not found
 */
export async function requireAuth() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    user = await syncUserFromClerk(userId)
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
