"use client"

import * as React from "react"
import { format } from "date-fns"
import { Clock, Flame, ChevronDown, Loader2 } from "lucide-react"
import { cn, formatDuration } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { TrainingType } from "./training-log-form"

const trainingTypeLabels: Record<TrainingType, string> = {
  static_apnea: "Static Apnea",
  dynamic_apnea: "Dynamic Apnea",
  depth_training: "Depth Training",
  co2_table: "CO2 Table",
  o2_table: "O2 Table",
  pool_session: "Pool Session",
  open_water: "Open Water",
  dry_training: "Dry Training",
  other: "Other",
}

const trainingTypeColors: Record<TrainingType, string> = {
  static_apnea: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  dynamic_apnea: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  depth_training: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  co2_table: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  o2_table: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  pool_session: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  open_water: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
  dry_training: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
}

export interface TrainingLog {
  id: string
  trainingType: TrainingType
  duration: number // minutes
  intensity: number // 1-10
  notes?: string
  date: Date
}

export interface TrainingHistoryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  logs: TrainingLog[]
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  loadingMore?: boolean
  onLogClick?: (log: TrainingLog) => void
}

function TrainingHistorySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="mt-3 flex gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

function TrainingHistory({
  logs,
  loading = false,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
  onLogClick,
  className,
  ...props
}: TrainingHistoryProps) {
  const getIntensityColor = (value: number): string => {
    if (value <= 3) return "text-green-600"
    if (value <= 5) return "text-yellow-600"
    if (value <= 7) return "text-orange-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        <TrainingHistorySkeleton />
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center",
          className
        )}
        {...props}
      >
        <p className="text-muted-foreground">No training logs yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Start logging your training to track your progress!
        </p>
      </div>
    )
  }

  // Group logs by date
  const groupedLogs = logs.reduce<Record<string, TrainingLog[]>>((acc, log) => {
    const dateKey = format(log.date, "yyyy-MM-dd")
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(log)
    return acc
  }, {})

  const sortedDates = Object.keys(groupedLogs).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {sortedDates.map((dateKey) => {
        const dateLogs = groupedLogs[dateKey]
        const displayDate = new Date(dateKey)

        return (
          <div key={dateKey} className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background py-1">
              {format(displayDate, "EEEE, MMMM d, yyyy")}
            </h3>
            <div className="space-y-2">
              {dateLogs.map((log) => (
                <button
                  key={log.id}
                  type="button"
                  className={cn(
                    "w-full text-left rounded-lg border p-4 transition-colors hover:bg-accent",
                    onLogClick && "cursor-pointer"
                  )}
                  onClick={() => onLogClick?.(log)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          trainingTypeColors[log.trainingType]
                        )}
                      >
                        {trainingTypeLabels[log.trainingType]}
                      </span>
                      {log.notes && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {log.notes}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {format(log.date, "h:mm a")}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(log.duration)}</span>
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1",
                        getIntensityColor(log.intensity)
                      )}
                    >
                      <Flame className="h-4 w-4" />
                      <span>
                        {log.intensity}/10 intensity
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      })}

      {/* Load More */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Load More
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export { TrainingHistory, TrainingHistorySkeleton }
