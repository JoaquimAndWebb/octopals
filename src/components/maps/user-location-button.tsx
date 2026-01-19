"use client"

import * as React from "react"
import { Locate, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/stores/use-app-store"
import { useToast } from "@/components/ui/use-toast"

interface UserLocationButtonProps {
  onLocationDetected?: (location: { lat: number; lng: number }) => void
  size?: "default" | "sm" | "lg" | "icon"
  showLabel?: boolean
  className?: string
}

export function UserLocationButton({
  onLocationDetected,
  size = "default",
  showLabel = true,
  className,
}: UserLocationButtonProps) {
  const { currentLocation, isLocating, detectLocation } = useAppStore()
  const { toast } = useToast()

  const handleClick = async () => {
    try {
      await detectLocation()
      const location = useAppStore.getState().currentLocation
      if (location) {
        onLocationDetected?.(location)
        toast({
          title: "Location detected",
          description: "Your location has been updated.",
        })
      }
    } catch (error) {
      console.error("Failed to detect location:", error)
      toast({
        title: "Location error",
        description: "Unable to detect your location. Please check your browser permissions.",
        variant: "destructive",
      })
    }
  }

  const hasLocation = currentLocation !== null

  return (
    <Button
      variant={hasLocation ? "secondary" : "outline"}
      size={size}
      onClick={handleClick}
      disabled={isLocating}
      className={cn(className)}
    >
      {isLocating ? (
        <Loader2 className={cn("h-4 w-4 animate-spin", showLabel && "mr-2")} />
      ) : (
        <Locate className={cn("h-4 w-4", showLabel && "mr-2")} />
      )}
      {showLabel && (isLocating ? "Detecting..." : hasLocation ? "Update location" : "Use my location")}
    </Button>
  )
}
