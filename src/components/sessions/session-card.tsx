"use client"

import * as React from "react"
import { Calendar, MapPin, Users, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SessionTypeBadge, type SessionType } from "./session-type-badge"

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "all"

const skillLevelLabels: Record<SkillLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  all: "All Levels",
}

const skillLevelColors: Record<SkillLevel, string> = {
  beginner: "bg-green-500",
  intermediate: "bg-yellow-500",
  advanced: "bg-red-500",
  all: "bg-blue-500",
}

export interface Session {
  id: string
  title: string
  date: Date
  endDate?: Date
  sessionType: SessionType
  venue?: string
  address?: string
  rsvpCount: number
  skillLevel: SkillLevel
  isCancelled?: boolean
}

export interface SessionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  session: Session
  onCardClick?: (session: Session) => void
}

function SessionCard({
  session,
  onCardClick,
  className,
  ...props
}: SessionCardProps) {
  const {
    title,
    date,
    endDate,
    sessionType,
    venue,
    rsvpCount,
    skillLevel,
    isCancelled,
  } = session

  const handleClick = () => {
    if (onCardClick) {
      onCardClick(session)
    }
  }

  return (
    <Card
      className={cn(
        "cursor-pointer transition-shadow hover:shadow-md",
        isCancelled && "opacity-60",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              "font-semibold leading-tight",
              isCancelled && "line-through"
            )}
          >
            {title}
          </h3>
          <SessionTypeBadge sessionType={sessionType} />
        </div>
        {isCancelled && (
          <div className="mt-1 flex items-center gap-1 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Cancelled</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span>
            {format(date, "EEE, MMM d")} at {format(date, "h:mm a")}
            {endDate && ` - ${format(endDate, "h:mm a")}`}
          </span>
        </div>

        {venue && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{venue}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {rsvpCount} {rsvpCount === 1 ? "going" : "going"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                skillLevelColors[skillLevel]
              )}
            />
            <span className="text-xs text-muted-foreground">
              {skillLevelLabels[skillLevel]}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { SessionCard }
