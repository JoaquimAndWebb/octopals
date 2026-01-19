"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  SKILL_LEVELS,
  SKILL_LEVEL_LABELS,
  SKILL_LEVEL_DESCRIPTIONS,
  type SkillLevel,
} from "@/lib/constants"

const skillLevelColors: Record<SkillLevel, { bg: string; border: string; text: string }> = {
  BEGINNER: {
    bg: "bg-green-50",
    border: "border-green-500",
    text: "text-green-700",
  },
  INTERMEDIATE: {
    bg: "bg-blue-50",
    border: "border-blue-500",
    text: "text-blue-700",
  },
  ADVANCED: {
    bg: "bg-purple-50",
    border: "border-purple-500",
    text: "text-purple-700",
  },
  ELITE: {
    bg: "bg-amber-50",
    border: "border-amber-500",
    text: "text-amber-700",
  },
}

export interface SkillLevelSelectorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: SkillLevel
  onChange?: (level: SkillLevel) => void
  disabled?: boolean
  error?: string
}

function SkillLevelSelector({
  value,
  onChange,
  disabled = false,
  error,
  className,
  ...props
}: SkillLevelSelectorProps) {
  const levels = Object.keys(SKILL_LEVELS) as SkillLevel[]

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="grid gap-3 sm:grid-cols-2">
        {levels.map((level) => {
          const isSelected = value === level
          const colors = skillLevelColors[level]

          return (
            <button
              key={level}
              type="button"
              disabled={disabled}
              onClick={() => onChange?.(level)}
              className={cn(
                "relative flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                disabled && "cursor-not-allowed opacity-50",
                isSelected
                  ? cn(colors.bg, colors.border)
                  : "border-border hover:border-primary/50 hover:bg-accent"
              )}
            >
              {isSelected && (
                <div
                  className={cn(
                    "absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full",
                    colors.border.replace("border", "bg"),
                    "text-white"
                  )}
                >
                  <Check className="h-3 w-3" />
                </div>
              )}
              <span
                className={cn(
                  "font-semibold",
                  isSelected ? colors.text : "text-foreground"
                )}
              >
                {SKILL_LEVEL_LABELS[level]}
              </span>
              <span
                className={cn(
                  "mt-1 text-sm",
                  isSelected ? colors.text : "text-muted-foreground"
                )}
              >
                {SKILL_LEVEL_DESCRIPTIONS[level]}
              </span>
            </button>
          )
        })}
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export { SkillLevelSelector }
