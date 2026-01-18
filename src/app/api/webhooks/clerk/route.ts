import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, username, first_name, last_name, image_url } = evt.data

    const primaryEmail = email_addresses.find((email) => email.id === evt.data.primary_email_address_id)

    await prisma.user.create({
      data: {
        clerkId: id,
        email: primaryEmail?.email_address ?? email_addresses[0]?.email_address ?? '',
        username: username ?? null,
        firstName: first_name ?? null,
        lastName: last_name ?? null,
        imageUrl: image_url ?? null,
      },
    })

    return new Response('User created', { status: 201 })
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, username, first_name, last_name, image_url } = evt.data

    const primaryEmail = email_addresses.find((email) => email.id === evt.data.primary_email_address_id)

    await prisma.user.update({
      where: { clerkId: id },
      data: {
        email: primaryEmail?.email_address ?? email_addresses[0]?.email_address ?? '',
        username: username ?? null,
        firstName: first_name ?? null,
        lastName: last_name ?? null,
        imageUrl: image_url ?? null,
      },
    })

    return new Response('User updated', { status: 200 })
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    if (id) {
      await prisma.user.delete({
        where: { clerkId: id },
      })
    }

    return new Response('User deleted', { status: 200 })
  }

  return new Response('Webhook received', { status: 200 })
}
