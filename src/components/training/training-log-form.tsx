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

export type TrainingType =
  | "static_apnea"
  | "dynamic_apnea"
  | "depth_training"
  | "co2_table"
  | "o2_table"
  | "pool_session"
  | "open_water"
  | "dry_training"
  | "other"

const trainingTypes: { value: TrainingType; label: string }[] = [
  { value: "static_apnea", label: "Static Apnea" },
  { value: "dynamic_apnea", label: "Dynamic Apnea" },
  { value: "depth_training", label: "Depth Training" },
  { value: "co2_table", label: "CO2 Table" },
  { value: "o2_table", label: "O2 Table" },
  { value: "pool_session", label: "Pool Session" },
  { value: "open_water", label: "Open Water" },
  { value: "dry_training", label: "Dry Training" },
  { value: "other", label: "Other" },
]

export interface TrainingLogFormData {
  trainingType: TrainingType
  duration: number // minutes
  intensity: number // 1-10
  notes: string
  date: Date
}

export interface TrainingLogFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  initialData?: Partial<TrainingLogFormData>
  onSubmit: (data: TrainingLogFormData) => void | Promise<void>
  loading?: boolean
  submitLabel?: string
}

function TrainingLogForm({
  initialData,
  onSubmit,
  loading = false,
  submitLabel = "Log Training",
  className,
  ...props
}: TrainingLogFormProps) {
  const [trainingType, setTrainingType] = React.useState<TrainingType>(
    initialData?.trainingType || "static_apnea"
  )
  const [duration, setDuration] = React.useState<string>(
    initialData?.duration?.toString() || ""
  )
  const [intensity, setIntensity] = React.useState<number>(
    initialData?.intensity || 5
  )
  const [notes, setNotes] = React.useState(initialData?.notes || "")
  const [date, setDate] = React.useState<Date>(initialData?.date || new Date())
  const [datePickerOpen, setDatePickerOpen] = React.useState(false)
  const [calendarViewDate, setCalendarViewDate] = React.useState<Date>(date)

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!duration || parseInt(duration, 10) <= 0) {
      newErrors.duration = "Duration must be greater than 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    await onSubmit({
      trainingType,
      duration: parseInt(duration, 10),
      intensity,
      notes: notes.trim(),
      date,
    })
  }

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

  const getIntensityLabel = (value: number): string => {
    if (value <= 3) return "Light"
    if (value <= 5) return "Moderate"
    if (value <= 7) return "Hard"
    return "Maximum"
  }

  const getIntensityColor = (value: number): string => {
    if (value <= 3) return "bg-green-500"
    if (value <= 5) return "bg-yellow-500"
    if (value <= 7) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <form
      className={cn("space-y-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      {/* Training Type */}
      <div className="space-y-2">
        <Label htmlFor="trainingType">Training Type</Label>
        <Select
          value={trainingType}
          onValueChange={(value) => setTrainingType(value as TrainingType)}
          disabled={loading}
        >
          <SelectTrigger id="trainingType">
            <SelectValue placeholder="Select training type" />
          </SelectTrigger>
          <SelectContent>
            {trainingTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date and Duration */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={loading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {renderCalendar()}
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes) *</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 60"
            error={errors.duration}
            disabled={loading}
          />
        </div>
      </div>

      {/* Intensity Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="intensity">Intensity</Label>
          <span className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                "h-3 w-3 rounded-full",
                getIntensityColor(intensity)
              )}
            />
            <span className="font-medium">{intensity}/10</span>
            <span className="text-muted-foreground">
              ({getIntensityLabel(intensity)})
            </span>
          </span>
        </div>
        <div className="relative">
          <input
            id="intensity"
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
            disabled={loading}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did the training go? Any observations?"
          rows={4}
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

export { TrainingLogForm, trainingTypes }
