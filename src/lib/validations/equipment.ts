import { z } from 'zod'

const EQUIPMENT_TYPES = ['STICK', 'GLOVE', 'MASK', 'SNORKEL', 'FINS', 'CAP', 'PUCK', 'GOAL'] as const
const EQUIPMENT_CONDITIONS = ['NEW', 'GOOD', 'FAIR', 'POOR'] as const
const EQUIPMENT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'JUNIOR', 'ADULT', 'ONE_SIZE'] as const

/**
 * Schema for creating new equipment
 */
export const createEquipmentSchema = z.object({
  clubId: z.string().cuid('Invalid club ID'),
  type: z.enum(EQUIPMENT_TYPES),
  name: z
    .string()
    .min(1, 'Equipment name is required')
    .max(100, 'Name too long'),
  description: z
    .string()
    .max(500, 'Description too long')
    .optional()
    .nullable(),
  size: z.enum(EQUIPMENT_SIZES).optional().nullable(),
  condition: z.enum(EQUIPMENT_CONDITIONS).default('GOOD'),
  purchaseDate: z.coerce.date().optional().nullable(),
  imageUrl: z.string().url('Invalid image URL').optional().nullable(),
  serialNumber: z.string().max(100).optional().nullable(),
  isAvailable: z.boolean().default(true),
  notes: z.string().max(500).optional().nullable(),
})

/**
 * Schema for updating equipment
 */
export const updateEquipmentSchema = createEquipmentSchema
  .omit({ clubId: true })
  .partial()

/**
 * Schema for bulk creating equipment
 */
export const bulkCreateEquipmentSchema = z.object({
  clubId: z.string().cuid('Invalid club ID'),
  equipment: z
    .array(createEquipmentSchema.omit({ clubId: true }))
    .min(1, 'At least one equipment item is required')
    .max(100, 'Cannot create more than 100 items at once'),
})

/**
 * Schema for checking out equipment
 */
export const checkoutSchema = z.object({
  equipmentId: z.string().cuid('Invalid equipment ID'),
  dueDate: z.coerce
    .date()
    .refine(
      (date) => date > new Date(),
      'Due date must be in the future'
    )
    .optional()
    .nullable(),
  conditionOut: z.enum(EQUIPMENT_CONDITIONS),
  photoOutUrl: z.string().url('Invalid photo URL').optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
})

/**
 * Schema for returning equipment
 */
export const returnEquipmentSchema = z.object({
  conditionIn: z.enum(EQUIPMENT_CONDITIONS),
  photoInUrl: z.string().url('Invalid photo URL').optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
})

/**
 * Schema for approving a checkout (admin)
 */
export const approveCheckoutSchema = z.object({
  checkoutId: z.string().cuid('Invalid checkout ID'),
  approved: z.boolean(),
  notes: z.string().max(500).optional().nullable(),
})

/**
 * Schema for equipment filters (query params)
 */
export const equipmentFiltersSchema = z.object({
  type: z.enum(EQUIPMENT_TYPES).optional(),
  size: z.enum(EQUIPMENT_SIZES).optional(),
  condition: z.enum(EQUIPMENT_CONDITIONS).optional(),
  isAvailable: z.coerce.boolean().optional(),
  clubId: z.string().cuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
})

// Type exports
export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>
export type UpdateEquipmentInput = z.infer<typeof updateEquipmentSchema>
export type BulkCreateEquipmentInput = z.infer<typeof bulkCreateEquipmentSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ReturnEquipmentInput = z.infer<typeof returnEquipmentSchema>
export type ApproveCheckoutInput = z.infer<typeof approveCheckoutSchema>
export type EquipmentFilters = z.infer<typeof equipmentFiltersSchema>
export type EquipmentType = (typeof EQUIPMENT_TYPES)[number]
export type EquipmentCondition = (typeof EQUIPMENT_CONDITIONS)[number]
export type EquipmentSize = (typeof EQUIPMENT_SIZES)[number]
