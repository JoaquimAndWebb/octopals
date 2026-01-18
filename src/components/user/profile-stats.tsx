"use client"

import * as React from "react"
import { Calendar, Users, Award, Timer } from "lucide-react"
import { cn, formatCompactNumber } from "@/lib/utils"

export interface ProfileStatsData {
  sessionsAttended?: number
  clubsJoined?: number
  badgesEarned?: number
  yearsPlaying?: number
}

export interface ProfileStatsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  stats: ProfileStatsData
  variant?: "default" | "compact"
}

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: number | string
  variant?: "default" | "compact"
}

function StatItem({ icon, label, value, variant = "default" }: StatItemProps) {
  const isCompact = variant === "compact"
  const displayValue =
    typeof value === "number" ? formatCompactNumber(value) : value

  return (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        isCompact ? "gap-1" : "gap-2"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-primary/10 text-primary",
          isCompact ? "h-8 w-8" : "h-10 w-10"
        )}
      >
        {icon}
      </div>
      <div>
        <p
          className={cn(
            "font-bold text-foreground",
            isCompact ? "text-lg" : "text-2xl"
          )}
        >
          {displayValue}
        </p>
        <p
          className={cn(
            "text-muted-foreground",
            isCompact ? "text-xs" : "text-sm"
          )}
        >
          {label}
        </p>
      </div>
    </div>
  )
}

function ProfileStats({
  stats,
  variant = "default",
  className,
  ...props
}: ProfileStatsProps) {
  const isCompact = variant === "compact"
  const iconSize = isCompact ? "h-4 w-4" : "h-5 w-5"

  const statItems = [
    {
      icon: <Calendar className={iconSize} />,
      label: "Sessions",
      value: stats.sessionsAttended ?? 0,
      show: stats.sessionsAttended !== undefined,
    },
    {
      icon: <Users className={iconSize} />,
      label: "Clubs",
      value: stats.clubsJoined ?? 0,
      show: stats.clubsJoined !== undefined,
    },
    {
      icon: <Award className={iconSize} />,
      label: "Badges",
      value: stats.badgesEarned ?? 0,
      show: stats.badgesEarned !== undefined,
    },
    {
      icon: <Timer className={iconSize} />,
      label: stats.yearsPlaying === 1 ? "Year Playing" : "Years Playing",
      value: stats.yearsPlaying ?? 0,
      show: stats.yearsPlaying !== undefined,
    },
  ].filter((item) => item.show)

  if (statItems.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        statItems.length === 4
          ? "grid-cols-2 sm:grid-cols-4"
          : statItems.length === 3
          ? "grid-cols-3"
          : statItems.length === 2
          ? "grid-cols-2"
          : "grid-cols-1",
        isCompact
          ? "p-3 bg-muted/50 rounded-lg"
          : "p-4 sm:p-6 bg-muted/50 rounded-lg",
        className
      )}
      {...props}
    >
      {statItems.map((item) => (
        <StatItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          value={item.value}
          variant={variant}
        />
      ))}
    </div>
  )
}

export { ProfileStats }
