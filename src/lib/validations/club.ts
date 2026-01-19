import { z } from 'zod'

/**
 * Schema for creating a new club
 */
export const createClubSchema = z.object({
  name: z
    .string()
    .min(2, 'Club name must be at least 2 characters')
    .max(100, 'Club name must be less than 100 characters'),
  description: z
    .string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional()
    .nullable(),
  foundedYear: z
    .number()
    .int()
    .min(1900, 'Founded year must be after 1900')
    .max(new Date().getFullYear(), 'Founded year cannot be in the future')
    .optional()
    .nullable(),
  imageUrl: z.string().url('Invalid image URL').optional().nullable(),
  coverImageUrl: z.string().url('Invalid cover image URL').optional().nullable(),
  website: z.string().url('Invalid website URL').optional().nullable(),
  email: z.string().email('Invalid email address').optional().nullable(),
  phone: z.string().max(20, 'Phone number too long').optional().nullable(),
  facebookUrl: z.string().url('Invalid Facebook URL').optional().nullable(),
  instagramUrl: z.string().url('Invalid Instagram URL').optional().nullable(),
  twitterUrl: z.string().url('Invalid Twitter URL').optional().nullable(),
  governingBody: z.string().max(100).optional().nullable(),
  welcomesBeginners: z.boolean().default(true),
  languagesSpoken: z.array(z.string()).default(['English']),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().max(500).optional().nullable(),
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),
})

/**
 * Schema for updating an existing club
 */
export const updateClubSchema = createClubSchema.partial().extend({
  isActive: z.boolean().optional(),
})

/**
 * Schema for creating a venue
 */
export const createVenueSchema = z.object({
  clubId: z.string().cuid('Invalid club ID'),
  name: z.string().min(1, 'Venue name is required').max(200),
  address: z.string().min(1, 'Address is required').max(500),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  poolLength: z.number().positive('Pool length must be positive').optional().nullable(),
  poolWidth: z.number().positive('Pool width must be positive').optional().nullable(),
  poolDepth: z.number().positive('Pool depth must be positive').optional().nullable(),
  waterTemp: z.number().min(0).max(50, 'Water temperature seems incorrect').optional().nullable(),
  hasAccessibility: z.boolean().default(false),
  notes: z.string().max(1000).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
})

/**
 * Schema for updating a venue
 */
export const updateVenueSchema = createVenueSchema.omit({ clubId: true }).partial()

/**
 * Schema for club membership management
 */
export const updateMemberRoleSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  role: z.enum(['MEMBER', 'COACH', 'EQUIPMENT_MANAGER', 'TREASURER', 'SESSION_COORDINATOR', 'ADMIN', 'OWNER']),
})

/**
 * Schema for joining a club
 */
export const joinClubSchema = z.object({
  message: z.string().max(500, 'Message too long').optional(),
})

/**
 * Schema for creating an announcement
 */
export const createAnnouncementSchema = z.object({
  clubId: z.string().cuid('Invalid club ID'),
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required').max(5000),
  isPinned: z.boolean().default(false),
})

/**
 * Schema for creating a review
 */
export const createReviewSchema = z.object({
  clubId: z.string().cuid('Invalid club ID'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  content: z.string().max(2000, 'Review too long').optional().nullable(),
})

/**
 * Schema for updating a review
 */
export const updateReviewSchema = createReviewSchema.omit({ clubId: true }).partial()

// Type exports
export type CreateClubInput = z.infer<typeof createClubSchema>
export type UpdateClubInput = z.infer<typeof updateClubSchema>
export type CreateVenueInput = z.infer<typeof createVenueSchema>
export type UpdateVenueInput = z.infer<typeof updateVenueSchema>
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>
export type JoinClubInput = z.infer<typeof joinClubSchema>
export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>
export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>
