"use client"

import * as React from "react"
import { Check, Circle, Clock } from "lucide-react"
import { cn, formatSeconds } from "@/lib/utils"

export type TableType = "co2" | "o2"

export interface ApneaRound {
  round: number
  holdTime: number // seconds
  restTime: number // seconds
  completed?: boolean
}

export interface ApneaTableProps extends React.HTMLAttributes<HTMLDivElement> {
  tableType: TableType
  rounds: ApneaRound[]
  currentRound?: number
  onRoundComplete?: (round: number) => void
}

const tableTypeInfo: Record<TableType, { title: string; description: string }> = {
  co2: {
    title: "CO2 Tolerance Table",
    description:
      "Constant hold time with decreasing rest periods to build CO2 tolerance",
  },
  o2: {
    title: "O2 Depletion Table",
    description:
      "Increasing hold time with constant rest periods to deplete oxygen stores",
  },
}

function generateCO2Table(baseHoldTime: number = 120): ApneaRound[] {
  const restTimes = [120, 105, 90, 75, 60, 45, 30, 15]
  return restTimes.map((restTime, index) => ({
    round: index + 1,
    holdTime: baseHoldTime,
    restTime,
  }))
}

function generateO2Table(baseHoldTime: number = 60): ApneaRound[] {
  const rounds = 8
  const increment = 15

  return Array.from({ length: rounds }, (_, index) => ({
    round: index + 1,
    holdTime: baseHoldTime + index * increment,
    restTime: 120, // 2 minutes rest
  }))
}

function ApneaTable({
  tableType,
  rounds,
  currentRound = 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRoundComplete,
  className,
  ...props
}: ApneaTableProps) {
  const info = tableTypeInfo[tableType]

  const getTotalTime = (): number => {
    return rounds.reduce(
      (total, round) => total + round.holdTime + round.restTime,
      0
    )
  }

  const getCompletedTime = (): number => {
    return rounds
      .filter((round) => round.completed || round.round < currentRound)
      .reduce((total, round) => total + round.holdTime + round.restTime, 0)
  }

  const progressPercentage =
    rounds.length > 0 ? (getCompletedTime() / getTotalTime()) * 100 : 0

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{info.title}</h3>
        <p className="text-sm text-muted-foreground">{info.description}</p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Total: {formatSeconds(getTotalTime())}</span>
          </div>
          <span>
            Round {Math.min(currentRound, rounds.length)} of {rounds.length}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <div className="grid grid-cols-4 gap-4 border-b bg-muted/50 p-3 text-sm font-medium">
          <div>Round</div>
          <div className="text-center">Hold</div>
          <div className="text-center">Rest</div>
          <div className="text-center">Status</div>
        </div>
        <div className="divide-y">
          {rounds.map((round) => {
            const isActive = round.round === currentRound
            const isCompleted =
              round.completed || round.round < currentRound

            return (
              <div
                key={round.round}
                className={cn(
                  "grid grid-cols-4 gap-4 p-3 text-sm transition-colors",
                  isActive && "bg-primary/5",
                  isCompleted && "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-2 font-medium",
                    isActive && "text-primary"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                      isActive && "bg-primary text-primary-foreground",
                      isCompleted && "bg-muted",
                      !isActive && !isCompleted && "bg-muted/50"
                    )}
                  >
                    {round.round}
                  </span>
                  {isActive && (
                    <span className="text-xs text-primary">Current</span>
                  )}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span className={cn(isActive && "font-semibold text-primary")}>
                    {formatSeconds(round.holdTime)}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <span className={cn(isActive && "font-semibold text-primary")}>
                    {formatSeconds(round.restTime)}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  {isCompleted ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="h-4 w-4" />
                      <span className="text-xs">Done</span>
                    </div>
                  ) : isActive ? (
                    <div className="flex items-center gap-1 text-primary">
                      <Circle className="h-4 w-4 animate-pulse fill-primary" />
                      <span className="text-xs">Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Circle className="h-4 w-4" />
                      <span className="text-xs">Pending</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1">
          <Check className="h-3 w-3 text-green-600" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <Circle className="h-3 w-3" />
          <span>Pending</span>
        </div>
      </div>
    </div>
  )
}

export { ApneaTable, generateCO2Table, generateO2Table }
