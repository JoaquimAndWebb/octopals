import { z } from 'zod'

const SKILL_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE'] as const
const POSITIONS = ['FORWARD', 'MIDFIELDER', 'BACK', 'GOALKEEPER', 'FLEXIBLE'] as const

/**
 * Schema for updating user profile
 */
export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    )
    .optional()
    .nullable(),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name too long')
    .optional(),
  lastName: z
    .string()
    .max(50, 'Last name too long')
    .optional()
    .nullable(),
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .nullable(),
  location: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  yearsPlaying: z
    .number()
    .int()
    .min(0, 'Years playing cannot be negative')
    .max(100, 'Years playing seems incorrect')
    .optional()
    .nullable(),
  primaryPosition: z.enum(POSITIONS).optional().nullable(),
  skillLevel: z.enum(SKILL_LEVELS).optional(),
  imageUrl: z.string().url('Invalid image URL').optional().nullable(),
})

/**
 * Schema for updating user settings/preferences
 */
export const updateSettingsSchema = z.object({
  isPublicProfile: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
})

/**
 * Schema for new user onboarding (step by step)
 */
export const onboardingSchema = z.object({
  // Step 1: Basic info
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name too long'),
  lastName: z
    .string()
    .max(50, 'Last name too long')
    .optional()
    .nullable(),
  location: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),

  // Step 2: Experience
  skillLevel: z.enum(SKILL_LEVELS).default('BEGINNER'),
  yearsPlaying: z
    .number()
    .int()
    .min(0)
    .max(100)
    .optional()
    .nullable(),
  primaryPosition: z.enum(POSITIONS).optional().nullable(),

  // Step 3: Profile (optional)
  imageUrl: z.string().url().optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
})

/**
 * Schema for onboarding step 1
 */
export const onboardingStep1Schema = onboardingSchema.pick({
  firstName: true,
  lastName: true,
  location: true,
  country: true,
  latitude: true,
  longitude: true,
})

/**
 * Schema for onboarding step 2
 */
export const onboardingStep2Schema = onboardingSchema.pick({
  skillLevel: true,
  yearsPlaying: true,
  primaryPosition: true,
})

/**
 * Schema for onboarding step 3
 */
export const onboardingStep3Schema = onboardingSchema.pick({
  imageUrl: true,
  bio: true,
})

/**
 * Schema for updating username only
 */
export const updateUsernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    ),
})

/**
 * Schema for updating location only
 */
export const updateLocationSchema = z.object({
  location: z.string().max(100),
  country: z.string().max(100).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

// Type exports
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>
export type OnboardingInput = z.infer<typeof onboardingSchema>
export type OnboardingStep1Input = z.infer<typeof onboardingStep1Schema>
export type OnboardingStep2Input = z.infer<typeof onboardingStep2Schema>
export type OnboardingStep3Input = z.infer<typeof onboardingStep3Schema>
export type UpdateUsernameInput = z.infer<typeof updateUsernameSchema>
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>
export type Position = (typeof POSITIONS)[number]
export type SkillLevel = (typeof SKILL_LEVELS)[number]
