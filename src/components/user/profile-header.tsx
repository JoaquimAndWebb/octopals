"use client"

import * as React from "react"
import { Edit, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { UserAvatar } from "./user-avatar"
import { ProfileStats, type ProfileStatsData } from "./profile-stats"
import { SKILL_LEVEL_LABELS, type SkillLevel } from "@/lib/constants"

const skillLevelColors: Record<SkillLevel, string> = {
  BEGINNER: "bg-green-100 text-green-800 border-green-200",
  INTERMEDIATE: "bg-blue-100 text-blue-800 border-blue-200",
  ADVANCED: "bg-purple-100 text-purple-800 border-purple-200",
  ELITE: "bg-amber-100 text-amber-800 border-amber-200",
}

export interface ProfileHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  user: {
    id: string
    firstName?: string | null
    lastName?: string | null
    fullName?: string | null
    imageUrl?: string | null
    coverImageUrl?: string | null
    bio?: string | null
    location?: string | null
    skillLevel?: SkillLevel | null
  }
  stats?: ProfileStatsData
  isOwnProfile?: boolean
  onEditClick?: () => void
}

function ProfileHeader({
  user,
  stats,
  isOwnProfile = false,
  onEditClick,
  className,
  ...props
}: ProfileHeaderProps) {
  const displayName =
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    "User"

  return (
    <div className={cn("relative", className)} {...props}>
      {/* Cover Image */}
      <div className="relative h-32 sm:h-48 md:h-56 bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-t-lg overflow-hidden">
        {user.coverImageUrl && (
          <img
            src={user.coverImageUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Profile Content */}
      <div className="relative px-4 sm:px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 sm:-top-20 left-4 sm:left-6">
          <UserAvatar
            src={user.imageUrl}
            firstName={user.firstName}
            lastName={user.lastName}
            fullName={user.fullName}
            size="xl"
            className="ring-4 ring-background"
          />
        </div>

        {/* Edit Button */}
        {isOwnProfile && onEditClick && (
          <div className="absolute top-4 right-4 sm:right-6">
            <Button
              variant="outline"
              size="sm"
              onClick={onEditClick}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit Profile</span>
            </Button>
          </div>
        )}

        {/* User Info */}
        <div className="pt-8 sm:pt-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {displayName}
                </h1>
                {user.skillLevel && (
                  <Badge
                    variant="outline"
                    className={cn(skillLevelColors[user.skillLevel])}
                  >
                    {SKILL_LEVEL_LABELS[user.skillLevel]}
                  </Badge>
                )}
              </div>

              {user.location && (
                <p className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {user.location}
                </p>
              )}

              {user.bio && (
                <p className="text-muted-foreground max-w-2xl mt-3">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="mt-6">
              <ProfileStats stats={stats} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { ProfileHeader }
