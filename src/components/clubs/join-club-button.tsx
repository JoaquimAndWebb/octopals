"use client"

import * as React from "react"
import { UserPlus, UserMinus, Clock, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface JoinClubButtonProps {
  isMember: boolean
  isPending?: boolean
  onJoin?: () => Promise<void>
  onLeave?: () => Promise<void>
  size?: "default" | "sm" | "lg"
  className?: string
}

export function JoinClubButton({
  isMember,
  isPending = false,
  onJoin,
  onLeave,
  size = "default",
  className,
}: JoinClubButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClick = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      if (isMember) {
        await onLeave?.()
      } else {
        await onJoin?.()
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isPending) {
    return (
      <Button
        variant="secondary"
        size={size}
        disabled
        className={cn(className)}
      >
        <Clock className="mr-2 h-4 w-4" />
        Pending
      </Button>
    )
  }

  if (isMember) {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={handleClick}
        disabled={isLoading}
        className={cn(className)}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <UserMinus className="mr-2 h-4 w-4" />
        )}
        Leave Club
      </Button>
    )
  }

  return (
    <Button
      variant="default"
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(className)}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <UserPlus className="mr-2 h-4 w-4" />
      )}
      Join Club
    </Button>
  )
}
