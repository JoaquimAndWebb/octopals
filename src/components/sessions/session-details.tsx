"use client"

import * as React from "react"
import { Calendar, Clock, MapPin, User, AlertCircle } from "lucide-react"
import { format, differenceInMinutes } from "date-fns"
import { cn, formatDuration } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SessionTypeBadge, type SessionType } from "./session-type-badge"
import type { SkillLevel } from "./session-card"

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

export interface SessionHost {
  id: string
  name: string
  avatarUrl?: string
}

export interface SessionDetailsData {
  id: string
  title: string
  description?: string
  date: Date
  endDate?: Date
  sessionType: SessionType
  venue?: string
  address?: string
  skillLevel: SkillLevel
  host?: SessionHost
  isCancelled?: boolean
  cancellationReason?: string
}

export interface SessionDetailsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  session: SessionDetailsData
  children?: React.ReactNode
}

function SessionDetails({
  session,
  children,
  className,
  ...props
}: SessionDetailsProps) {
  const {
    title,
    description,
    date,
    endDate,
    sessionType,
    venue,
    address,
    skillLevel,
    host,
    isCancelled,
    cancellationReason,
  } = session

  const durationMinutes = endDate
    ? differenceInMinutes(endDate, date)
    : undefined

  return (
    <Card className={cn(isCancelled && "opacity-75", className)} {...props}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle
              className={cn("text-xl", isCancelled && "line-through")}
            >
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <SessionTypeBadge sessionType={sessionType} />
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    skillLevelColors[skillLevel]
                  )}
                />
                <span className="text-sm text-muted-foreground">
                  {skillLevelLabels[skillLevel]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isCancelled && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">This session has been cancelled</p>
              {cancellationReason && (
                <p className="mt-1 text-sm opacity-90">{cancellationReason}</p>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date and Time */}
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">{format(date, "EEEE, MMMM d, yyyy")}</p>
            <p className="text-sm text-muted-foreground">
              {format(date, "h:mm a")}
              {endDate && ` - ${format(endDate, "h:mm a")}`}
            </p>
          </div>
        </div>

        {/* Duration */}
        {durationMinutes && (
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Duration</p>
              <p className="text-sm text-muted-foreground">
                {formatDuration(durationMinutes)}
              </p>
            </div>
          </div>
        )}

        {/* Venue */}
        {(venue || address) && (
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              {venue && <p className="font-medium">{venue}</p>}
              {address && (
                <p className="text-sm text-muted-foreground">{address}</p>
              )}
            </div>
          </div>
        )}

        {/* Host */}
        {host && (
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex items-center gap-2">
              <span className="font-medium">Hosted by</span>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={host.avatarUrl} alt={host.name} />
                  <AvatarFallback>
                    {host.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{host.name}</span>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="border-t pt-4">
            <h4 className="mb-2 font-medium">About this session</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {description}
            </p>
          </div>
        )}

        {/* Children slot for additional content like RSVP buttons */}
        {children && <div className="border-t pt-4">{children}</div>}
      </CardContent>
    </Card>
  )
}

export { SessionDetails }
