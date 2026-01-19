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
        training: "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        scrimmage: "border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        competition: "border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        social: "border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        workshop: "border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        other: "border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
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
