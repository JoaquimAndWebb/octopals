"use client"

import * as React from "react"
import { format } from "date-fns"
import { Trophy, TrendingUp, Award } from "lucide-react"
import { cn, formatSeconds } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

export interface PersonalBestCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  metricName: string
  value: number // Value in appropriate units
  unit?: string
  dateAchieved: Date
  previousBest?: number
  isNew?: boolean
  icon?: "trophy" | "award" | "trending"
}

const icons = {
  trophy: Trophy,
  award: Award,
  trending: TrendingUp,
}

function PersonalBestCard({
  metricName,
  value,
  unit,
  dateAchieved,
  previousBest,
  isNew = false,
  icon = "trophy",
  className,
  ...props
}: PersonalBestCardProps) {
  const Icon = icons[icon]

  // Format the value based on whether it looks like seconds (for breath holds)
  const formatValue = (val: number): string => {
    // If the value looks like seconds (typical breath hold range), format as time
    if (unit === "seconds" || (!unit && val >= 10 && val <= 600)) {
      return formatSeconds(val)
    }
    // Otherwise, format as a number with optional unit
    if (unit === "meters" || unit === "m") {
      return `${val}m`
    }
    return val.toString()
  }

  const improvement =
    previousBest && previousBest > 0
      ? ((value - previousBest) / previousBest) * 100
      : null

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all",
        isNew && "ring-2 ring-primary ring-offset-2",
        className
      )}
      {...props}
    >
      {/* New badge */}
      {isNew && (
        <div className="absolute -right-8 top-3 rotate-45 bg-primary px-8 py-0.5 text-xs font-semibold text-primary-foreground">
          NEW!
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full",
              isNew
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Icon className="h-6 w-6" />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {metricName}
            </p>
            <p className="text-3xl font-bold tracking-tight">
              {formatValue(value)}
              {unit && !["seconds", "meters", "m"].includes(unit) && (
                <span className="ml-1 text-lg font-normal text-muted-foreground">
                  {unit}
                </span>
              )}
            </p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Achieved {format(dateAchieved, "MMM d, yyyy")}</span>
              {improvement !== null && improvement > 0 && (
                <span className="flex items-center gap-0.5 text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  +{improvement.toFixed(1)}%
                </span>
              )}
            </div>

            {previousBest && previousBest !== value && (
              <p className="text-xs text-muted-foreground">
                Previous best: {formatValue(previousBest)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { PersonalBestCard }
