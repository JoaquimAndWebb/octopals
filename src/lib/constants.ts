// OctoPals Application Constants

export const APP_NAME = "OctoPals"
export const APP_DESCRIPTION = "Underwater hockey community platform"
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://octopals.app"

// Default settings
export const DEFAULT_RADIUS_KM = 50
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// Skill Levels
export const SKILL_LEVELS = {
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
  ELITE: "ELITE",
} as const

export const SKILL_LEVEL_LABELS: Record<keyof typeof SKILL_LEVELS, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  ELITE: "Elite",
}

export const SKILL_LEVEL_DESCRIPTIONS: Record<keyof typeof SKILL_LEVELS, string> = {
  BEGINNER: "New to underwater hockey, learning basic skills",
  INTERMEDIATE: "Comfortable with fundamentals, developing game sense",
  ADVANCED: "Strong technical skills, experienced in competitive play",
  ELITE: "High-level competitive player, national/international experience",
}

export type SkillLevel = keyof typeof SKILL_LEVELS

// Player Positions
export const POSITIONS = {
  FORWARD: "FORWARD",
  MIDFIELDER: "MIDFIELDER",
  BACK: "BACK",
  GOALKEEPER: "GOALKEEPER",
  FLEXIBLE: "FLEXIBLE",
} as const

export const POSITION_LABELS: Record<keyof typeof POSITIONS, string> = {
  FORWARD: "Forward",
  MIDFIELDER: "Midfielder",
  BACK: "Back",
  GOALKEEPER: "Goalkeeper",
  FLEXIBLE: "Flexible",
}

export type Position = keyof typeof POSITIONS

// Session Types
export const SESSION_TYPES = {
  TRAINING: "TRAINING",
  SCRIMMAGE: "SCRIMMAGE",
  PICKUP: "PICKUP",
  BEGINNER_INTRO: "BEGINNER_INTRO",
  COMPETITION_PREP: "COMPETITION_PREP",
  SOCIAL: "SOCIAL",
} as const

export const SESSION_TYPE_LABELS: Record<keyof typeof SESSION_TYPES, string> = {
  TRAINING: "Training",
  SCRIMMAGE: "Scrimmage",
  PICKUP: "Pickup Game",
  BEGINNER_INTRO: "Beginner Introduction",
  COMPETITION_PREP: "Competition Prep",
  SOCIAL: "Social Event",
}

export const SESSION_TYPE_COLORS: Record<keyof typeof SESSION_TYPES, string> = {
  TRAINING: "bg-ocean-200 text-ocean-900 dark:bg-ocean-800 dark:text-ocean-200",
  SCRIMMAGE: "bg-ocean-400 text-ocean-950 dark:bg-ocean-700 dark:text-ocean-100",
  PICKUP: "bg-gold-400 text-navy-950 dark:bg-gold-600 dark:text-ocean-100",
  BEGINNER_INTRO: "bg-ocean-300 text-ocean-900 dark:bg-ocean-700 dark:text-ocean-200",
  COMPETITION_PREP: "bg-sunset-400 text-navy-950 dark:bg-sunset-600 dark:text-ocean-100",
  SOCIAL: "bg-ocean-500 text-ocean-950 dark:bg-ocean-600 dark:text-ocean-100",
}

export type SessionType = keyof typeof SESSION_TYPES

// RSVP Statuses
export const RSVP_STATUSES = {
  YES: "YES",
  NO: "NO",
  MAYBE: "MAYBE",
} as const

export const RSVP_STATUS_LABELS: Record<keyof typeof RSVP_STATUSES, string> = {
  YES: "Going",
  NO: "Not Going",
  MAYBE: "Maybe",
}

export type RsvpStatus = keyof typeof RSVP_STATUSES

// Equipment Types
export const EQUIPMENT_TYPES = {
  STICK: "STICK",
  GLOVE: "GLOVE",
  MASK: "MASK",
  SNORKEL: "SNORKEL",
  FINS: "FINS",
  CAP: "CAP",
  PUCK: "PUCK",
  GOAL: "GOAL",
} as const

export const EQUIPMENT_TYPE_LABELS: Record<keyof typeof EQUIPMENT_TYPES, string> = {
  STICK: "Stick",
  GLOVE: "Glove",
  MASK: "Mask",
  SNORKEL: "Snorkel",
  FINS: "Fins",
  CAP: "Cap",
  PUCK: "Puck",
  GOAL: "Goal",
}

export type EquipmentType = keyof typeof EQUIPMENT_TYPES

// Equipment Conditions
export const EQUIPMENT_CONDITIONS = {
  NEW: "NEW",
  GOOD: "GOOD",
  FAIR: "FAIR",
  POOR: "POOR",
} as const

export const EQUIPMENT_CONDITION_LABELS: Record<keyof typeof EQUIPMENT_CONDITIONS, string> = {
  NEW: "New",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
}

export const EQUIPMENT_CONDITION_COLORS: Record<keyof typeof EQUIPMENT_CONDITIONS, string> = {
  NEW: "bg-ocean-300 text-ocean-900 dark:bg-ocean-700 dark:text-ocean-100",
  GOOD: "bg-ocean-400 text-ocean-950 dark:bg-ocean-600 dark:text-ocean-100",
  FAIR: "bg-gold-400 text-navy-950 dark:bg-gold-600 dark:text-ocean-100",
  POOR: "bg-sunset-400 text-navy-950 dark:bg-sunset-600 dark:text-ocean-100",
}

export type EquipmentCondition = keyof typeof EQUIPMENT_CONDITIONS

// Equipment Sizes
export const EQUIPMENT_SIZES = {
  XS: "XS",
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
  XXL: "XXL",
  JUNIOR: "JUNIOR",
  ADULT: "ADULT",
  ONE_SIZE: "ONE_SIZE",
} as const

export const EQUIPMENT_SIZE_LABELS: Record<keyof typeof EQUIPMENT_SIZES, string> = {
  XS: "Extra Small",
  S: "Small",
  M: "Medium",
  L: "Large",
  XL: "Extra Large",
  XXL: "2X Large",
  JUNIOR: "Junior",
  ADULT: "Adult",
  ONE_SIZE: "One Size",
}

export type EquipmentSize = keyof typeof EQUIPMENT_SIZES

// Club Roles
export const CLUB_ROLES = {
  MEMBER: "MEMBER",
  COACH: "COACH",
  EQUIPMENT_MANAGER: "EQUIPMENT_MANAGER",
  TREASURER: "TREASURER",
  SESSION_COORDINATOR: "SESSION_COORDINATOR",
  ADMIN: "ADMIN",
  OWNER: "OWNER",
} as const

export const CLUB_ROLE_LABELS: Record<keyof typeof CLUB_ROLES, string> = {
  MEMBER: "Member",
  COACH: "Coach",
  EQUIPMENT_MANAGER: "Equipment Manager",
  TREASURER: "Treasurer",
  SESSION_COORDINATOR: "Session Coordinator",
  ADMIN: "Admin",
  OWNER: "Owner",
}

export type ClubRole = keyof typeof CLUB_ROLES

// Subscription Tiers
export const SUBSCRIPTION_TIERS = {
  FREE: "FREE",
  PLAYER_PRO: "PLAYER_PRO",
  CLUB_STARTER: "CLUB_STARTER",
  CLUB_PRO: "CLUB_PRO",
  CLUB_ELITE: "CLUB_ELITE",
} as const

export const SUBSCRIPTION_TIER_LABELS: Record<keyof typeof SUBSCRIPTION_TIERS, string> = {
  FREE: "Free",
  PLAYER_PRO: "Player Pro",
  CLUB_STARTER: "Club Starter",
  CLUB_PRO: "Club Pro",
  CLUB_ELITE: "Club Elite",
}

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS

// Training Types
export const TRAINING_TYPES = {
  APNEA_DRY: "APNEA_DRY",
  POOL_FITNESS: "POOL_FITNESS",
  STICK_WORK: "STICK_WORK",
  SCRIMMAGE: "SCRIMMAGE",
  COMPETITION: "COMPETITION",
  GYM: "GYM",
  OTHER: "OTHER",
} as const

export const TRAINING_TYPE_LABELS: Record<keyof typeof TRAINING_TYPES, string> = {
  APNEA_DRY: "Apnea (Dry)",
  POOL_FITNESS: "Pool Fitness",
  STICK_WORK: "Stick Work",
  SCRIMMAGE: "Scrimmage",
  COMPETITION: "Competition",
  GYM: "Gym Training",
  OTHER: "Other",
}

export type TrainingType = keyof typeof TRAINING_TYPES

// Breath Hold Types
export const BREATH_HOLD_TYPES = {
  STATIC: "STATIC",
  CO2_TABLE: "CO2_TABLE",
  O2_TABLE: "O2_TABLE",
  FREE: "FREE",
} as const

export const BREATH_HOLD_TYPE_LABELS: Record<keyof typeof BREATH_HOLD_TYPES, string> = {
  STATIC: "Static Hold",
  CO2_TABLE: "CO2 Table",
  O2_TABLE: "O2 Table",
  FREE: "Free Hold",
}

export type BreathHoldType = keyof typeof BREATH_HOLD_TYPES

// Notification Types
export const NOTIFICATION_TYPES = {
  SESSION_REMINDER: "SESSION_REMINDER",
  SESSION_CANCELLED: "SESSION_CANCELLED",
  SESSION_UPDATED: "SESSION_UPDATED",
  RSVP_UPDATE: "RSVP_UPDATE",
  NEW_MESSAGE: "NEW_MESSAGE",
  CLUB_ANNOUNCEMENT: "CLUB_ANNOUNCEMENT",
  CLUB_INVITATION: "CLUB_INVITATION",
  MEMBERSHIP_APPROVED: "MEMBERSHIP_APPROVED",
  EQUIPMENT_DUE: "EQUIPMENT_DUE",
  EQUIPMENT_OVERDUE: "EQUIPMENT_OVERDUE",
  COMPETITION_REMINDER: "COMPETITION_REMINDER",
  BADGE_EARNED: "BADGE_EARNED",
  SYSTEM: "SYSTEM",
} as const

export type NotificationType = keyof typeof NOTIFICATION_TYPES

// Days of the week
export const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
] as const

// Time slots for session scheduling
export const TIME_SLOTS = [
  { value: "morning", label: "Morning (6am - 12pm)" },
  { value: "afternoon", label: "Afternoon (12pm - 6pm)" },
  { value: "evening", label: "Evening (6pm - 10pm)" },
] as const

// Distance options for filtering
export const DISTANCE_OPTIONS = [
  { value: 10, label: "10 km" },
  { value: 25, label: "25 km" },
  { value: 50, label: "50 km" },
  { value: 100, label: "100 km" },
  { value: 250, label: "250 km" },
  { value: 500, label: "500 km" },
] as const

// Badge categories
export const BADGE_CATEGORIES = {
  ATTENDANCE: "ATTENDANCE",
  COMMUNITY: "COMMUNITY",
  PERFORMANCE: "PERFORMANCE",
  TRAINING: "TRAINING",
} as const

export type BadgeCategory = keyof typeof BADGE_CATEGORIES

// Intensity levels (1-10)
export const INTENSITY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

// Rating scale (1-5)
export const RATING_SCALE = [1, 2, 3, 4, 5] as const

// Languages commonly spoken in UWH communities
export const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Dutch",
  "Portuguese",
  "Italian",
  "Japanese",
  "Chinese",
  "Korean",
  "Russian",
  "Arabic",
  "Indonesian",
  "Thai",
  "Turkish",
] as const
