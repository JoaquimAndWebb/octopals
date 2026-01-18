"use client"

import * as React from "react"
import { Check, HelpCircle, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { RsvpStatus } from "./rsvp-button"

export interface RsvpUser {
  id: string
  name: string
  avatarUrl?: string
  status: Exclude<RsvpStatus, null | "no">
}

export interface RsvpListProps extends React.HTMLAttributes<HTMLDivElement> {
  rsvps: RsvpUser[]
  maxDisplay?: number
  showCounts?: boolean
}

function RsvpList({
  rsvps,
  maxDisplay = 10,
  showCounts = true,
  className,
  ...props
}: RsvpListProps) {
  const goingRsvps = rsvps.filter((rsvp) => rsvp.status === "yes")
  const maybeRsvps = rsvps.filter((rsvp) => rsvp.status === "maybe")

  const totalGoing = goingRsvps.length
  const totalMaybe = maybeRsvps.length

  const displayedGoing = goingRsvps.slice(0, maxDisplay)
  const displayedMaybe = maybeRsvps.slice(0, maxDisplay - displayedGoing.length)

  const remainingGoing = totalGoing - displayedGoing.length
  const remainingMaybe = totalMaybe - displayedMaybe.length

  if (rsvps.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-6 text-center text-muted-foreground",
          className
        )}
        {...props}
      >
        <Users className="mb-2 h-8 w-8" />
        <p>No RSVPs yet</p>
        <p className="text-sm">Be the first to RSVP!</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* Summary counts */}
      {showCounts && (
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Check className="h-4 w-4 text-green-600" />
            <span>
              {totalGoing} {totalGoing === 1 ? "going" : "going"}
            </span>
          </div>
          {totalMaybe > 0 && (
            <div className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4 text-yellow-600" />
              <span>{totalMaybe} maybe</span>
            </div>
          )}
        </div>
      )}

      {/* Going section */}
      {displayedGoing.length > 0 && (
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-medium">
            <Check className="h-4 w-4 text-green-600" />
            Going ({totalGoing})
          </h4>
          <div className="space-y-2">
            {displayedGoing.map((rsvp) => (
              <div key={rsvp.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={rsvp.avatarUrl} alt={rsvp.name} />
                  <AvatarFallback>
                    {rsvp.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{rsvp.name}</span>
              </div>
            ))}
            {remainingGoing > 0 && (
              <p className="text-sm text-muted-foreground pl-11">
                +{remainingGoing} more
              </p>
            )}
          </div>
        </div>
      )}

      {/* Maybe section */}
      {displayedMaybe.length > 0 && (
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-medium">
            <HelpCircle className="h-4 w-4 text-yellow-600" />
            Maybe ({totalMaybe})
          </h4>
          <div className="space-y-2">
            {displayedMaybe.map((rsvp) => (
              <div key={rsvp.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={rsvp.avatarUrl} alt={rsvp.name} />
                  <AvatarFallback>
                    {rsvp.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{rsvp.name}</span>
              </div>
            ))}
            {remainingMaybe > 0 && (
              <p className="text-sm text-muted-foreground pl-11">
                +{remainingMaybe} more
              </p>
            )}
          </div>
        </div>
      )}

      {/* Avatar stack (compact view) */}
      <div className="flex items-center gap-2 pt-2 border-t">
        <div className="flex -space-x-2">
          {rsvps.slice(0, 5).map((rsvp) => (
            <Avatar
              key={rsvp.id}
              className="h-8 w-8 border-2 border-background"
            >
              <AvatarImage src={rsvp.avatarUrl} alt={rsvp.name} />
              <AvatarFallback className="text-xs">
                {rsvp.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          {rsvps.length > 5 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
              +{rsvps.length - 5}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { RsvpList }
