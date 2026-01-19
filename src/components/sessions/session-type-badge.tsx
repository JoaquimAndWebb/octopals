"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export type SessionType =
  | "training"
  | "scrimmage"
  | "competition"
  | "social"
  | "workshop"
  | "other"

const sessionTypeBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      type: {
        training: "border-transparent bg-ocean-200 text-ocean-900 dark:bg-ocean-800 dark:text-ocean-200",
        scrimmage: "border-transparent bg-ocean-400 text-ocean-950 dark:bg-ocean-700 dark:text-ocean-100",
        competition: "border-transparent bg-sunset-400 text-navy-950 dark:bg-sunset-600 dark:text-ocean-100",
        social: "border-transparent bg-ocean-500 text-ocean-950 dark:bg-ocean-600 dark:text-ocean-100",
        workshop: "border-transparent bg-gold-400 text-navy-950 dark:bg-gold-600 dark:text-ocean-100",
        other: "border-transparent bg-ocean-300 text-ocean-900 dark:bg-ocean-900 dark:text-ocean-200",
      },
    },
    defaultVariants: {
      type: "other",
    },
  }
)

const sessionTypeLabels: Record<SessionType, string> = {
  training: "Training",
  scrimmage: "Scrimmage",
  competition: "Competition",
  social: "Social",
  workshop: "Workshop",
  other: "Other",
}

export interface SessionTypeBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sessionTypeBadgeVariants> {
  sessionType: SessionType
}

function SessionTypeBadge({
  className,
  sessionType,
  ...props
}: SessionTypeBadgeProps) {
  return (
    <div
      className={cn(sessionTypeBadgeVariants({ type: sessionType }), className)}
      {...props}
    >
      {sessionTypeLabels[sessionType]}
    </div>
  )
}

export { SessionTypeBadge, sessionTypeBadgeVariants }
