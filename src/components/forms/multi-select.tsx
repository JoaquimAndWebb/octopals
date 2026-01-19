"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface MultiSelectOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface MultiSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: MultiSelectOption[]
  value?: string[]
  onChange?: (value: string[]) => void
  disabled?: boolean
  error?: string
  columns?: 1 | 2 | 3
  variant?: "default" | "card"
}

function MultiSelect({
  options,
  value = [],
  onChange,
  disabled = false,
  error,
  columns = 1,
  variant = "default",
  className,
  ...props
}: MultiSelectProps) {
  const handleToggle = (optionValue: string) => {
    if (disabled) return

    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue]

    onChange?.(newValue)
  }

  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  }

  if (variant === "card") {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        <div className={cn("grid gap-3", columnClasses[columns])}>
          {options.map((option) => {
            const isChecked = value.includes(option.value)
            const isDisabled = disabled || option.disabled

            return (
              <button
                key={option.value}
                type="button"
                disabled={isDisabled}
                onClick={() => handleToggle(option.value)}
                className={cn(
                  "relative flex items-start gap-3 rounded-lg border p-4 text-left transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isDisabled && "cursor-not-allowed opacity-50",
                  isChecked
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-accent"
                )}
              >
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                    isChecked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground"
                  )}
                >
                  {isChecked && <Check className="h-3 w-3" />}
                </div>
                <div className="flex-1 space-y-1">
                  <span className="font-medium text-foreground">
                    {option.label}
                  </span>
                  {option.description && (
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  )}
                </div>
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

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className={cn("grid gap-2", columnClasses[columns])}>
        {options.map((option) => {
          const isChecked = value.includes(option.value)
          const isDisabled = disabled || option.disabled
          const id = `multi-select-${option.value}`

          return (
            <div key={option.value} className="flex items-start gap-3">
              <Checkbox
                id={id}
                checked={isChecked}
                onCheckedChange={() => handleToggle(option.value)}
                disabled={isDisabled}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <Label
                  htmlFor={id}
                  className={cn(
                    "cursor-pointer font-normal",
                    isDisabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  {option.label}
                </Label>
                {option.description && (
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
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

export { MultiSelect }
