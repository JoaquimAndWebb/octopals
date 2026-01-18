"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  SKILL_LEVELS,
  SKILL_LEVEL_LABELS,
  DAYS_OF_WEEK,
  type SkillLevel,
} from "@/lib/constants"
import { useFilterStore } from "@/stores/use-filter-store"

interface ClubFiltersProps {
  className?: string
}

const DISTANCE_MARKS = [10, 25, 50, 100, 250, 500]

export function ClubFilters({ className }: ClubFiltersProps) {
  const {
    distance,
    skillLevel,
    sessionDays,
    welcomesBeginners,
    hasEquipment,
    setDistance,
    setSkillLevel,
    setSessionDays,
    setWelcomesBeginners,
    setHasEquipment,
    resetFilters,
  } = useFilterStore()

  const handleSkillLevelChange = (level: SkillLevel, checked: boolean) => {
    if (checked) {
      setSkillLevel(level)
    } else if (skillLevel === level) {
      setSkillLevel(null)
    }
  }

  const handleDayChange = (day: string, checked: boolean) => {
    if (checked) {
      setSessionDays([...sessionDays, day])
    } else {
      setSessionDays(sessionDays.filter((d) => d !== day))
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Distance Slider */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Distance</Label>
        <div className="space-y-2">
          <input
            type="range"
            min={DISTANCE_MARKS[0]}
            max={DISTANCE_MARKS[DISTANCE_MARKS.length - 1]}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{DISTANCE_MARKS[0]} km</span>
            <span className="font-medium text-foreground">{distance} km</span>
            <span>{DISTANCE_MARKS[DISTANCE_MARKS.length - 1]} km</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Skill Level Checkboxes */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Skill Level</Label>
        <div className="space-y-2">
          {Object.keys(SKILL_LEVELS).map((level) => (
            <div key={level} className="flex items-center gap-2">
              <Checkbox
                id={`skill-${level}`}
                checked={skillLevel === level}
                onCheckedChange={(checked) =>
                  handleSkillLevelChange(level as SkillLevel, checked as boolean)
                }
              />
              <Label
                htmlFor={`skill-${level}`}
                className="cursor-pointer text-sm font-normal"
              >
                {SKILL_LEVEL_LABELS[level as SkillLevel]}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Session Days Checkboxes */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Session Days</Label>
        <div className="space-y-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day.value} className="flex items-center gap-2">
              <Checkbox
                id={`day-${day.value}`}
                checked={sessionDays.includes(day.value)}
                onCheckedChange={(checked) =>
                  handleDayChange(day.value, checked as boolean)
                }
              />
              <Label
                htmlFor={`day-${day.value}`}
                className="cursor-pointer text-sm font-normal"
              >
                {day.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Toggle Switches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="welcomes-beginners" className="cursor-pointer text-sm">
            Beginner-friendly
          </Label>
          <Switch
            id="welcomes-beginners"
            checked={welcomesBeginners === true}
            onCheckedChange={(checked) => setWelcomesBeginners(checked || null)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="has-equipment" className="cursor-pointer text-sm">
            Has equipment
          </Label>
          <Switch
            id="has-equipment"
            checked={hasEquipment === true}
            onCheckedChange={(checked) => setHasEquipment(checked || null)}
          />
        </div>
      </div>

      <Separator />

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={resetFilters}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset Filters
      </Button>
    </div>
  )
}
