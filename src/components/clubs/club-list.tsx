"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { ClubCard, type Club } from "./club-card"
import { MapPin } from "lucide-react"

interface ClubListProps {
  clubs: Club[]
  isLoading?: boolean
  emptyMessage?: string
  className?: string
}

function ClubCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="p-4">
        <Skeleton className="mb-2 h-5 w-3/4" />
        <Skeleton className="mb-2 h-4 w-1/2" />
        <div className="mb-3 flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function ClubList({
  clubs,
  isLoading = false,
  emptyMessage = "No clubs found",
  className,
}: ClubListProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          className
        )}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <ClubCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (clubs.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title="No clubs found"
        description={emptyMessage}
        className={className}
      />
    )
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {clubs.map((club) => (
        <ClubCard key={club.id} club={club} />
      ))}
    </div>
  )
}
