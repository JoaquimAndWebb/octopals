"use client"

import * as React from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isSameMonth,
  isSameDay,
  isToday,
  setHours,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Session } from "./session-card"

type CalendarView = "month" | "week"

export interface SessionCalendarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sessions: Session[]
  view?: CalendarView
  onDateSelect?: (date: Date) => void
  onSessionClick?: (session: Session) => void
  initialDate?: Date
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 6) // 6 AM to 7 PM

function SessionCalendar({
  sessions,
  view: initialView = "month",
  onDateSelect,
  onSessionClick,
  initialDate,
  className,
  ...props
}: SessionCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(initialDate || new Date())
  const [view, setView] = React.useState<CalendarView>(initialView)

  const sessionsOnDate = React.useCallback(
    (date: Date): Session[] => {
      return sessions.filter((session) => isSameDay(session.date, date))
    },
    [sessions]
  )

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1))
    } else {
      setCurrentDate(subWeeks(currentDate, 1))
    }
  }

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1))
    } else {
      setCurrentDate(addWeeks(currentDate, 1))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days: React.ReactNode[] = []
    let day = startDate

    // Header row with day names
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    while (day <= endDate) {
      const currentDay = day
      const daySessionsFound = sessionsOnDate(currentDay)
      const isCurrentMonth = isSameMonth(currentDay, monthStart)
      const isCurrentDay = isToday(currentDay)

      days.push(
        <button
          key={day.toString()}
          className={cn(
            "relative flex h-12 w-full flex-col items-center justify-start rounded-md p-1 text-sm transition-colors hover:bg-accent",
            !isCurrentMonth && "text-muted-foreground opacity-50",
            isCurrentDay && "bg-accent font-semibold"
          )}
          onClick={() => onDateSelect?.(currentDay)}
          type="button"
        >
          <span>{format(currentDay, "d")}</span>
          {daySessionsFound.length > 0 && (
            <div className="mt-0.5 flex gap-0.5">
              {daySessionsFound.slice(0, 3).map((_, index) => (
                <div
                  key={index}
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                />
              ))}
              {daySessionsFound.length > 3 && (
                <span className="text-[10px] text-muted-foreground">
                  +{daySessionsFound.length - 3}
                </span>
              )}
            </div>
          )}
        </button>
      )

      day = addDays(day, 1)
    }

    return (
      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
          {dayNames.map((name) => (
            <div key={name} className="py-2">
              {name}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate)
    const days: Date[] = []

    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i))
    }

    return (
      <div className="space-y-2">
        {/* Day headers */}
        <div className="grid grid-cols-8 gap-1">
          <div className="w-16" /> {/* Time column spacer */}
          {days.map((day) => (
            <div
              key={day.toString()}
              className={cn(
                "flex flex-col items-center rounded-lg p-2 text-center",
                isToday(day) && "bg-accent"
              )}
            >
              <span className="text-xs text-muted-foreground">
                {format(day, "EEE")}
              </span>
              <span
                className={cn(
                  "text-lg font-semibold",
                  isToday(day) && "text-primary"
                )}
              >
                {format(day, "d")}
              </span>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="max-h-96 overflow-y-auto">
          <div className="relative">
            {HOURS.map((hour) => {
              const timeLabel = format(setHours(new Date(), hour), "h a")

              return (
                <div key={hour} className="grid grid-cols-8 gap-1">
                  <div className="flex h-12 w-16 items-start justify-end pr-2 text-xs text-muted-foreground">
                    {timeLabel}
                  </div>
                  {days.map((day) => {
                    const daySessions = sessionsOnDate(day).filter(
                      (session) => session.date.getHours() === hour
                    )

                    return (
                      <div
                        key={day.toString()}
                        className="h-12 border-t border-border"
                      >
                        {daySessions.map((session) => (
                          <button
                            key={session.id}
                            className="w-full truncate rounded bg-primary/10 px-1 py-0.5 text-left text-xs text-primary hover:bg-primary/20"
                            onClick={() => onSessionClick?.(session)}
                            type="button"
                          >
                            {session.title}
                          </button>
                        ))}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* Calendar header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <h2 className="ml-2 text-lg font-semibold">
            {view === "month"
              ? format(currentDate, "MMMM yyyy")
              : `Week of ${format(startOfWeek(currentDate), "MMM d, yyyy")}`}
          </h2>
        </div>

        <div className="flex gap-1">
          <Button
            variant={view === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("month")}
          >
            Month
          </Button>
          <Button
            variant={view === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("week")}
          >
            Week
          </Button>
        </div>
      </div>

      {/* Calendar body */}
      {view === "month" ? renderMonthView() : renderWeekView()}
    </div>
  )
}

export { SessionCalendar }
