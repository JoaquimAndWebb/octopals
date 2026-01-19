"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { SessionType } from "./session-type-badge"
import type { SkillLevel } from "./session-card"

const sessionTypes: { value: SessionType; label: string }[] = [
  { value: "training", label: "Training" },
  { value: "scrimmage", label: "Scrimmage" },
  { value: "competition", label: "Competition" },
  { value: "social", label: "Social" },
  { value: "workshop", label: "Workshop" },
  { value: "other", label: "Other" },
]

const skillLevels: { value: SkillLevel; label: string }[] = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]

export interface Venue {
  id: string
  name: string
}

export interface SessionFormData {
  title: string
  description: string
  date: Date
  startTime: string
  endTime: string
  sessionType: SessionType
  venueId: string
  skillLevel: SkillLevel
  maxAttendees?: number
}

export interface CreateSessionFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  venues?: Venue[]
  initialData?: Partial<SessionFormData>
  onSubmit: (data: SessionFormData) => void | Promise<void>
  loading?: boolean
  submitLabel?: string
}

function CreateSessionForm({
  venues = [],
  initialData,
  onSubmit,
  loading = false,
  submitLabel = "Create Session",
  className,
  ...props
}: CreateSessionFormProps) {
  const [title, setTitle] = React.useState(initialData?.title || "")
  const [description, setDescription] = React.useState(
    initialData?.description || ""
  )
  const [date, setDate] = React.useState<Date | undefined>(initialData?.date)
  const [startTime, setStartTime] = React.useState(
    initialData?.startTime || "10:00"
  )
  const [endTime, setEndTime] = React.useState(initialData?.endTime || "12:00")
  const [sessionType, setSessionType] = React.useState<SessionType>(
    initialData?.sessionType || "training"
  )
  const [venueId, setVenueId] = React.useState(initialData?.venueId || "")
  const [skillLevel, setSkillLevel] = React.useState<SkillLevel>(
    initialData?.skillLevel || "all"
  )
  const [maxAttendees, setMaxAttendees] = React.useState<string>(
    initialData?.maxAttendees?.toString() || ""
  )
  const [datePickerOpen, setDatePickerOpen] = React.useState(false)
  const [calendarViewDate, setCalendarViewDate] = React.useState<Date>(
    initialData?.date || new Date()
  )

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!date) {
      newErrors.date = "Date is required"
    }
    if (!startTime) {
      newErrors.startTime = "Start time is required"
    }
    if (!endTime) {
      newErrors.endTime = "End time is required"
    }
    if (startTime >= endTime) {
      newErrors.endTime = "End time must be after start time"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate() || !date) return

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      date,
      startTime,
      endTime,
      sessionType,
      venueId,
      skillLevel,
      maxAttendees: maxAttendees ? parseInt(maxAttendees, 10) : undefined,
    })
  }

  // Simple inline calendar component
  const renderCalendar = () => {
    const monthStart = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth(), 1)
    const monthEnd = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 0)
    const startDay = monthStart.getDay()
    const daysInMonth = monthEnd.getDate()

    const days: (number | null)[] = []
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    const prevMonth = () => {
      setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1))
    }

    const nextMonth = () => {
      setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1))
    }

    const selectDay = (day: number) => {
      const newDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth(), day)
      setDate(newDate)
      setDatePickerOpen(false)
    }

    return (
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={prevMonth}
          >
            <span className="sr-only">Previous month</span>
            &lt;
          </Button>
          <span className="text-sm font-medium">
            {format(calendarViewDate, "MMMM yyyy")}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={nextMonth}
          >
            <span className="sr-only">Next month</span>
            &gt;
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="py-1 text-muted-foreground">
              {day}
            </div>
          ))}
          {days.map((day, index) => (
            <div key={index}>
              {day ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0",
                    date &&
                      date.getDate() === day &&
                      date.getMonth() === calendarViewDate.getMonth() &&
                      date.getFullYear() === calendarViewDate.getFullYear() &&
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  )}
                  onClick={() => selectDay(day)}
                >
                  {day}
                </Button>
              ) : (
                <div className="h-8 w-8" />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <form
      className={cn("space-y-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Weekly Pool Training"
          error={errors.title}
          disabled={loading}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the session..."
          rows={4}
          disabled={loading}
        />
      </div>

      {/* Date and Time */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Date *</Label>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  errors.date && "border-destructive"
                )}
                disabled={loading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {renderCalendar()}
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-sm text-destructive">{errors.date}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time *</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            error={errors.startTime}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time *</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            error={errors.endTime}
            disabled={loading}
          />
        </div>
      </div>

      {/* Session Type and Skill Level */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sessionType">Session Type</Label>
          <Select
            value={sessionType}
            onValueChange={(value) => setSessionType(value as SessionType)}
            disabled={loading}
          >
            <SelectTrigger id="sessionType">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {sessionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="skillLevel">Skill Level</Label>
          <Select
            value={skillLevel}
            onValueChange={(value) => setSkillLevel(value as SkillLevel)}
            disabled={loading}
          >
            <SelectTrigger id="skillLevel">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {skillLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Venue */}
      {venues.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="venue">Venue</Label>
          <Select
            value={venueId}
            onValueChange={setVenueId}
            disabled={loading}
          >
            <SelectTrigger id="venue">
              <SelectValue placeholder="Select venue" />
            </SelectTrigger>
            <SelectContent>
              {venues.map((venue) => (
                <SelectItem key={venue.id} value={venue.id}>
                  {venue.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Max Attendees */}
      <div className="space-y-2">
        <Label htmlFor="maxAttendees">Max Attendees (optional)</Label>
        <Input
          id="maxAttendees"
          type="number"
          min="1"
          value={maxAttendees}
          onChange={(e) => setMaxAttendees(e.target.value)}
          placeholder="No limit"
          disabled={loading}
        />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  )
}

export { CreateSessionForm }
