import { z } from 'zod'

const TRAINING_TYPES = ['APNEA_DRY', 'POOL_FITNESS', 'STICK_WORK', 'SCRIMMAGE', 'COMPETITION', 'GYM', 'OTHER'] as const
const BREATH_HOLD_TYPES = ['STATIC', 'CO2_TABLE', 'O2_TABLE', 'FREE'] as const

/**
 * Schema for creating a training log entry
 */
export const trainingLogSchema = z.object({
  date: z.coerce
    .date()
    .refine(
      (date) => date <= new Date(),
      'Training date cannot be in the future'
    )
    .default(() => new Date()),
  type: z.enum(TRAINING_TYPES),
  durationMins: z
    .number()
    .int()
    .positive('Duration must be positive')
    .max(600, 'Duration seems too long (max 10 hours)'),
  intensity: z
    .number()
    .int()
    .min(1, 'Intensity must be at least 1')
    .max(10, 'Intensity must be at most 10')
    .optional()
    .nullable(),
  notes: z.string().max(1000, 'Notes too long').optional().nullable(),
})

/**
 * Schema for updating a training log entry
 */
export const updateTrainingLogSchema = trainingLogSchema.partial()

/**
 * Schema for recording a breath hold
 */
export const breathHoldSchema = z.object({
  date: z.coerce
    .date()
    .refine(
      (date) => date <= new Date(),
      'Date cannot be in the future'
    )
    .default(() => new Date()),
  durationSeconds: z
    .number()
    .int()
    .positive('Duration must be positive')
    .max(600, 'Duration seems too long (max 10 minutes)'),
  type: z.enum(BREATH_HOLD_TYPES).default('STATIC'),
  tableRound: z
    .number()
    .int()
    .positive()
    .max(20, 'Table round seems too high')
    .optional()
    .nullable(),
  restSeconds: z
    .number()
    .int()
    .positive()
    .max(600)
    .optional()
    .nullable(),
  heartRateBefore: z
    .number()
    .int()
    .positive()
    .max(300, 'Heart rate seems incorrect')
    .optional()
    .nullable(),
  heartRateAfter: z
    .number()
    .int()
    .positive()
    .max(300, 'Heart rate seems incorrect')
    .optional()
    .nullable(),
  difficulty: z
    .number()
    .int()
    .min(1)
    .max(10)
    .optional()
    .nullable(),
  notes: z.string().max(500).optional().nullable(),
})

/**
 * Schema for updating a breath hold record
 */
export const updateBreathHoldSchema = breathHoldSchema.partial()

/**
 * Schema for recording a full table training session (multiple holds)
 */
export const tableSessionSchema = z.object({
  type: z.enum(['CO2_TABLE', 'O2_TABLE']),
  date: z.coerce.date().default(() => new Date()),
  rounds: z
    .array(
      z.object({
        round: z.number().int().positive(),
        durationSeconds: z.number().int().positive(),
        restSeconds: z.number().int().positive(),
        difficulty: z.number().int().min(1).max(10).optional(),
      })
    )
    .min(1, 'At least one round is required')
    .max(20, 'Too many rounds'),
  notes: z.string().max(500).optional().nullable(),
})

/**
 * Schema for training filters (query params)
 */
export const trainingFiltersSchema = z.object({
  type: z.enum(TRAINING_TYPES).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
})

/**
 * Schema for breath hold filters (query params)
 */
export const breathHoldFiltersSchema = z.object({
  type: z.enum(BREATH_HOLD_TYPES).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
})

/**
 * Schema for generating a CO2 table based on personal best
 */
export const generateCO2TableSchema = z.object({
  personalBestSeconds: z
    .number()
    .int()
    .positive()
    .max(600, 'Personal best seems too long'),
  rounds: z.number().int().min(4).max(12).default(8),
  holdPercentage: z.number().min(0.3).max(0.6).default(0.5), // % of PB to hold each round
})

/**
 * Schema for generating an O2 table based on personal best
 */
export const generateO2TableSchema = z.object({
  personalBestSeconds: z
    .number()
    .int()
    .positive()
    .max(600, 'Personal best seems too long'),
  rounds: z.number().int().min(4).max(12).default(8),
  startingRestSeconds: z.number().int().min(60).max(180).default(120),
  restDecrement: z.number().int().min(5).max(30).default(15),
})

// Type exports
export type TrainingLogInput = z.infer<typeof trainingLogSchema>
export type UpdateTrainingLogInput = z.infer<typeof updateTrainingLogSchema>
export type BreathHoldInput = z.infer<typeof breathHoldSchema>
export type UpdateBreathHoldInput = z.infer<typeof updateBreathHoldSchema>
export type TableSessionInput = z.infer<typeof tableSessionSchema>
export type TrainingFilters = z.infer<typeof trainingFiltersSchema>
export type BreathHoldFilters = z.infer<typeof breathHoldFiltersSchema>
export type GenerateCO2TableInput = z.infer<typeof generateCO2TableSchema>
export type GenerateO2TableInput = z.infer<typeof generateO2TableSchema>
export type TrainingType = (typeof TRAINING_TYPES)[number]
export type BreathHoldType = (typeof BREATH_HOLD_TYPES)[number]
