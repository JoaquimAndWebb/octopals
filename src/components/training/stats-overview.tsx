"use client"

import * as React from "react"
import { Calendar, Clock, TrendingUp, Activity } from "lucide-react"
import { cn, formatDuration, formatSeconds } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export interface TrainingStats {
  sessionsThisWeek: number
  sessionsThisMonth: number
  totalTrainingTimeThisWeek: number // minutes
  totalTrainingTimeThisMonth: number // minutes
  breathHoldImprovement?: number // percentage
  currentBestHold?: number // seconds
  previousBestHold?: number // seconds
  averageIntensity?: number // 1-10
}

export interface StatsOverviewProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: TrainingStats
  loading?: boolean
  period?: "week" | "month"
}

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  trend?: {
    value: number
    isPositive: boolean
  }
}

function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2">
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <span
              className={cn(
                "flex items-center text-xs font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              <TrendingUp
                className={cn(
                  "mr-0.5 h-3 w-3",
                  !trend.isPositive && "rotate-180"
                )}
              />
              {trend.isPositive ? "+" : ""}
              {trend.value.toFixed(1)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-1" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  )
}

function StatsOverview({
  stats,
  loading = false,
  period = "week",
  className,
  ...props
}: StatsOverviewProps) {
  if (loading) {
    return (
      <div
        className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}
        {...props}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  const sessions =
    period === "week" ? stats.sessionsThisWeek : stats.sessionsThisMonth
  const totalTime =
    period === "week"
      ? stats.totalTrainingTimeThisWeek
      : stats.totalTrainingTimeThisMonth

  return (
    <div
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}
      {...props}
    >
      {/* Sessions */}
      <StatCard
        title={`Sessions This ${period === "week" ? "Week" : "Month"}`}
        value={sessions}
        subtitle={`${sessions === 1 ? "session" : "sessions"} completed`}
        icon={Calendar}
      />

      {/* Total Training Time */}
      <StatCard
        title="Total Training Time"
        value={formatDuration(totalTime)}
        subtitle={`this ${period}`}
        icon={Clock}
      />

      {/* Breath Hold Progress */}
      {stats.currentBestHold !== undefined && (
        <StatCard
          title="Best Breath Hold"
          value={formatSeconds(stats.currentBestHold)}
          subtitle={
            stats.previousBestHold
              ? `Previous: ${formatSeconds(stats.previousBestHold)}`
              : undefined
          }
          icon={Activity}
          trend={
            stats.breathHoldImprovement !== undefined
              ? {
                  value: stats.breathHoldImprovement,
                  isPositive: stats.breathHoldImprovement >= 0,
                }
              : undefined
          }
        />
      )}

      {/* Average Intensity */}
      {stats.averageIntensity !== undefined && (
        <StatCard
          title="Average Intensity"
          value={`${stats.averageIntensity.toFixed(1)}/10`}
          subtitle={getIntensityLabel(stats.averageIntensity)}
          icon={TrendingUp}
        />
      )}

      {/* Placeholder cards if some stats are missing */}
      {stats.currentBestHold === undefined && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Best Breath Hold
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--:--</div>
            <p className="text-xs text-muted-foreground">
              Log a breath hold to track
            </p>
          </CardContent>
        </Card>
      )}

      {stats.averageIntensity === undefined && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Intensity
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--/10</div>
            <p className="text-xs text-muted-foreground">
              Log training sessions to track
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function getIntensityLabel(intensity: number): string {
  if (intensity <= 3) return "Light training"
  if (intensity <= 5) return "Moderate effort"
  if (intensity <= 7) return "Hard training"
  return "Maximum effort"
}

export { StatsOverview, StatCardSkeleton }
