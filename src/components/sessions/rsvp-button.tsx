"use client"

import * as React from "react"
import { Check, X, HelpCircle, ChevronDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type RsvpStatus = "yes" | "no" | "maybe" | null

const rsvpConfig: Record<
  Exclude<RsvpStatus, null>,
  {
    label: string
    icon: React.ElementType
    color: string
    bgColor: string
  }
> = {
  yes: {
    label: "Going",
    icon: Check,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950 hover:bg-green-100 dark:hover:bg-green-900",
  },
  no: {
    label: "Not Going",
    icon: X,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900",
  },
  maybe: {
    label: "Maybe",
    icon: HelpCircle,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950 hover:bg-yellow-100 dark:hover:bg-yellow-900",
  },
}

export interface RsvpButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  status: RsvpStatus
  onChange: (status: RsvpStatus) => void
  loading?: boolean
}

function RsvpButton({
  status,
  onChange,
  loading = false,
  className,
  disabled,
  ...props
}: RsvpButtonProps) {
  const currentConfig = status ? rsvpConfig[status] : null

  if (loading) {
    return (
      <Button variant="outline" disabled className={className} {...props}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Updating...
      </Button>
    )
  }

  // If no status, show RSVP button
  if (!currentConfig) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            className={className}
            disabled={disabled}
            {...props}
          >
            RSVP
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {(Object.entries(rsvpConfig) as [Exclude<RsvpStatus, null>, typeof rsvpConfig.yes][]).map(
            ([key, config]) => {
              const Icon = config.icon
              return (
                <DropdownMenuItem
                  key={key}
                  onClick={() => onChange(key)}
                  className="gap-2"
                >
                  <Icon className={cn("h-4 w-4", config.color)} />
                  <span>{config.label}</span>
                </DropdownMenuItem>
              )
            }
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Show current status with dropdown to change
  const Icon = currentConfig.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(currentConfig.bgColor, "border-0", className)}
          disabled={disabled}
          {...props}
        >
          <Icon className={cn("mr-2 h-4 w-4", currentConfig.color)} />
          <span className={currentConfig.color}>{currentConfig.label}</span>
          <ChevronDown className={cn("ml-2 h-4 w-4", currentConfig.color)} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.entries(rsvpConfig) as [Exclude<RsvpStatus, null>, typeof rsvpConfig.yes][]).map(
          ([key, config]) => {
            const ItemIcon = config.icon
            const isActive = key === status
            return (
              <DropdownMenuItem
                key={key}
                onClick={() => onChange(key)}
                className={cn("gap-2", isActive && "bg-accent")}
              >
                <ItemIcon className={cn("h-4 w-4", config.color)} />
                <span>{config.label}</span>
                {isActive && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            )
          }
        )}
        <DropdownMenuItem
          onClick={() => onChange(null)}
          className="gap-2 text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span>Remove RSVP</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { RsvpButton }
