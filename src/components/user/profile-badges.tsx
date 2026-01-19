"use client"

import * as React from "react"
import { Award } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { type BadgeCategory } from "@/lib/constants"

const badgeCategoryColors: Record<BadgeCategory, string> = {
  ATTENDANCE: "bg-blue-100 text-blue-600 border-blue-200",
  COMMUNITY: "bg-green-100 text-green-600 border-green-200",
  PERFORMANCE: "bg-purple-100 text-purple-600 border-purple-200",
  TRAINING: "bg-amber-100 text-amber-600 border-amber-200",
}


export interface UserBadge {
  id: string
  name: string
  description: string
  iconUrl?: string | null
  category: BadgeCategory
  earnedAt?: Date | string
}

export interface ProfileBadgesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  badges: UserBadge[]
  maxDisplay?: number
  showEmptyState?: boolean
  emptyStateMessage?: string
}

function BadgeItem({ badge }: { badge: UserBadge }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full border-2 cursor-pointer transition-transform hover:scale-110",
              badgeCategoryColors[badge.category]
            )}
          >
            {badge.iconUrl ? (
              <img
                src={badge.iconUrl}
                alt={badge.name}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <Award className="h-6 w-6" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">{badge.name}</p>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
            {badge.earnedAt && (
              <p className="text-xs text-muted-foreground">
                Earned:{" "}
                {new Date(badge.earnedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function ProfileBadges({
  badges,
  maxDisplay,
  showEmptyState = true,
  emptyStateMessage = "No badges earned yet. Keep participating to earn your first badge!",
  className,
  ...props
}: ProfileBadgesProps) {
  const displayBadges = maxDisplay ? badges.slice(0, maxDisplay) : badges
  const remainingCount = maxDisplay ? badges.length - maxDisplay : 0

  if (badges.length === 0) {
    if (!showEmptyState) return null

    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-8 text-center",
          className
        )}
        {...props}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Award className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground max-w-xs">
          {emptyStateMessage}
        </p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="flex flex-wrap gap-3">
        {displayBadges.map((badge) => (
          <BadgeItem key={badge.id} badge={badge} />
        ))}
        {remainingCount > 0 && (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium">
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  )
}

export { ProfileBadges, BadgeItem }
