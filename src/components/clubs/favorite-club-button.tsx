"use client"

import * as React from "react"
import { Heart, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FavoriteClubButtonProps {
  isFavorite: boolean
  onToggle?: () => Promise<void>
  size?: "default" | "sm" | "lg" | "icon"
  showLabel?: boolean
  className?: string
}

export function FavoriteClubButton({
  isFavorite,
  onToggle,
  size = "icon",
  showLabel = false,
  className,
}: FavoriteClubButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return

    setIsLoading(true)
    try {
      await onToggle?.()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={cn(className)}
    >
      {isLoading ? (
        <Loader2 className={cn("h-4 w-4 animate-spin", showLabel && "mr-2")} />
      ) : (
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            showLabel && "mr-2",
            isFavorite && "fill-red-500 text-red-500"
          )}
        />
      )}
      {showLabel && (isFavorite ? "Favorited" : "Favorite")}
    </Button>
  )
}
