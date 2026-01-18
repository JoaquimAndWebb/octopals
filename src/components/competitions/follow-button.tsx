"use client"

import * as React from "react"
import { Star, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FollowButtonProps {
  isFollowing: boolean
  onFollow?: () => Promise<void>
  onUnfollow?: () => Promise<void>
  size?: "default" | "sm" | "lg"
  className?: string
}

export function FollowButton({
  isFollowing,
  onFollow,
  onUnfollow,
  size = "default",
  className,
}: FollowButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClick = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      if (isFollowing) {
        await onUnfollow?.()
      } else {
        await onFollow?.()
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isFollowing) {
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
          <Star className="mr-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
        )}
        Following
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
        <Star className="mr-2 h-4 w-4" />
      )}
      Follow
    </Button>
  )
}
