"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { SessionCard, type Session } from "./session-card"

export interface SessionListProps extends React.HTMLAttributes<HTMLDivElement> {
  sessions: Session[]
  loading?: boolean
  emptyMessage?: string
  onSessionClick?: (session: Session) => void
}

function SessionCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SessionList({
  sessions,
  loading = false,
  emptyMessage = "No sessions found",
  onSessionClick,
  className,
  ...props
}: SessionListProps) {
  if (loading) {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        {Array.from({ length: 3 }).map((_, index) => (
          <SessionCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center",
          className
        )}
        {...props}
      >
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          onCardClick={onSessionClick}
        />
      ))}
    </div>
  )
}

export { SessionList, SessionCardSkeleton }
