"use client"

import * as React from "react"
import { MapPin, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { UserAvatar } from "./user-avatar"
import { SKILL_LEVEL_LABELS, type SkillLevel } from "@/lib/constants"

const skillLevelColors: Record<SkillLevel, string> = {
  BEGINNER: "bg-green-100 text-green-800 border-green-200",
  INTERMEDIATE: "bg-blue-100 text-blue-800 border-blue-200",
  ADVANCED: "bg-purple-100 text-purple-800 border-purple-200",
  ELITE: "bg-amber-100 text-amber-800 border-amber-200",
}

export interface UserCardProps extends React.HTMLAttributes<HTMLDivElement> {
  user: {
    id: string
    firstName?: string | null
    lastName?: string | null
    fullName?: string | null
    imageUrl?: string | null
    skillLevel?: SkillLevel | null
    location?: string | null
    clubsCount?: number
  }
  showClubsCount?: boolean
  onClick?: () => void
}

function UserCard({
  user,
  showClubsCount = true,
  onClick,
  className,
  ...props
}: UserCardProps) {
  const displayName =
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    "Unknown User"

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:border-primary/50",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <UserAvatar
          src={user.imageUrl}
          firstName={user.firstName}
          lastName={user.lastName}
          fullName={user.fullName}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">
            {displayName}
          </h3>
          {user.skillLevel && (
            <Badge
              variant="outline"
              className={cn(
                "mt-1 text-xs",
                skillLevelColors[user.skillLevel]
              )}
            >
              {SKILL_LEVEL_LABELS[user.skillLevel]}
            </Badge>
          )}
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            {user.location && (
              <span className="flex items-center gap-1 truncate">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{user.location}</span>
              </span>
            )}
            {showClubsCount && user.clubsCount !== undefined && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {user.clubsCount} {user.clubsCount === 1 ? "club" : "clubs"}
                </span>
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { UserCard }
