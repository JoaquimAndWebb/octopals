"use client"

import * as React from "react"
import { Trophy } from "lucide-react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { CompetitionCard, type Competition } from "./competition-card"

interface CompetitionListProps {
  competitions: Competition[]
  isLoading?: boolean
  emptyMessage?: string
  className?: string
}

function CompetitionCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="flex flex-col sm:flex-row">
        <Skeleton className="aspect-[16/9] w-full sm:aspect-square sm:w-48" />
        <div className="flex-1 p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="mb-2 h-4 w-1/3" />
          <div className="mb-3 space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CompetitionList({
  competitions,
  isLoading = false,
  emptyMessage = "No competitions found",
  className,
}: CompetitionListProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <CompetitionCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (competitions.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="No competitions found"
        description={emptyMessage}
        className={className}
      />
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {competitions.map((competition) => (
        <CompetitionCard key={competition.id} competition={competition} />
      ))}
    </div>
  )
}
