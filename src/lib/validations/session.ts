import { z } from 'zod'

const SESSION_TYPES = ['TRAINING', 'SCRIMMAGE', 'PICKUP', 'BEGINNER_INTRO', 'COMPETITION_PREP', 'SOCIAL'] as const
const SKILL_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE'] as const
const RSVP_STATUSES = ['YES', 'NO', 'MAYBE'] as const

/**
 * Schema for creating a new session
 */
export const createSessionSchema = z
  .object({
    clubId: z.string().cuid('Invalid club ID'),
    venueId: z.string().cuid('Invalid venue ID').optional().nullable(),
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title must be less than 200 characters'),
    description: z
      .string()
      .max(2000, 'Description must be less than 2000 characters')
      .optional()
      .nullable(),
    type: z.enum(SESSION_TYPES).default('TRAINING'),
    skillLevel: z.enum(SKILL_LEVELS).optional().nullable(),
    startTime: z.coerce.date().refine(
      (date) => date > new Date(),
      'Start time must be in the future'
    ),
    endTime: z.coerce.date(),
    maxAttendees: z
      .number()
      .int()
      .positive('Max attendees must be positive')
      .optional()
      .nullable(),
    isRecurring: z.boolean().default(false),
    recurringRule: z
      .string()
      .max(500, 'Recurring rule too long')
      .optional()
      .nullable(),
  })
  .refine(
    (data) => data.endTime > data.startTime,
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  )

/**
 * Schema for updating an existing session
 */
export const updateSessionSchema = z
  .object({
    venueId: z.string().cuid('Invalid venue ID').optional().nullable(),
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title must be less than 200 characters')
      .optional(),
    description: z
      .string()
      .max(2000, 'Description must be less than 2000 characters')
      .optional()
      .nullable(),
    type: z.enum(SESSION_TYPES).optional(),
    skillLevel: z.enum(SKILL_LEVELS).optional().nullable(),
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
    maxAttendees: z
      .number()
      .int()
      .positive('Max attendees must be positive')
      .optional()
      .nullable(),
    isCancelled: z.boolean().optional(),
    cancelReason: z.string().max(500).optional().nullable(),
    isRecurring: z.boolean().optional(),
    recurringRule: z
      .string()
      .max(500, 'Recurring rule too long')
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.endTime > data.startTime
      }
      return true
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  )

/**
 * Schema for cancelling a session
 */
export const cancelSessionSchema = z.object({
  cancelReason: z
    .string()
    .min(1, 'Please provide a reason for cancellation')
    .max(500, 'Reason too long'),
})

/**
 * Schema for RSVP to a session
 */
export const rsvpSchema = z.object({
  status: z.enum(RSVP_STATUSES),
  note: z.string().max(200, 'Note too long').optional().nullable(),
})

/**
 * Schema for checking in to a session
 */
export const checkinSchema = z.object({
  method: z.enum(['QR', 'GPS', 'MANUAL']).default('MANUAL'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
})

/**
 * Schema for session filters (query params)
 */
export const sessionFiltersSchema = z.object({
  clubId: z.string().cuid().optional(),
  type: z.enum(SESSION_TYPES).optional(),
  skillLevel: z.enum(SKILL_LEVELS).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  includesCancelled: z.coerce.boolean().default(false),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
})

// Type exports
export type CreateSessionInput = z.infer<typeof createSessionSchema>
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>
export type CancelSessionInput = z.infer<typeof cancelSessionSchema>
export type RsvpInput = z.infer<typeof rsvpSchema>
export type CheckinInput = z.infer<typeof checkinSchema>
export type SessionFilters = z.infer<typeof sessionFiltersSchema>
export type SessionType = (typeof SESSION_TYPES)[number]
export type SkillLevel = (typeof SKILL_LEVELS)[number]
export type RsvpStatus = (typeof RSVP_STATUSES)[number]
