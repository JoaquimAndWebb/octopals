import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/pricing',
  '/clubs(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/og',
])

async function syncUserToDb(clerkId: string) {
  const existingUser = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  })

  if (existingUser) {
    return existingUser
  }

  const clerk = await clerkClient()
  const clerkUser = await clerk.users.getUser(clerkId)

  const user = await prisma.user.upsert({
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

  return user
}

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()

    const { userId } = await auth()
    if (userId) {
      await syncUserToDb(userId)
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
