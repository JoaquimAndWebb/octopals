"use client"

import * as React from "react"
import { Marker } from "react-map-gl/mapbox"
import { MapPin } from "lucide-react"

import { cn } from "@/lib/utils"

export interface ClubMarkerData {
  id: string
  name: string
  slug: string
  latitude: number
  longitude: number
  imageUrl?: string | null
  memberCount: number
  rating: number
  isVerified: boolean
  city: string
  country: string
}

interface ClubMarkerProps {
  club: ClubMarkerData
  onClick?: () => void
  isSelected?: boolean
}

function getMarkerSize(memberCount: number): "sm" | "md" | "lg" {
  if (memberCount < 20) return "sm"
  if (memberCount < 50) return "md"
  return "lg"
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
}

const iconSizeClasses = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
}

export function ClubMarker({ club, onClick, isSelected }: ClubMarkerProps) {
  const size = getMarkerSize(club.memberCount)

  return (
    <Marker
      latitude={club.latitude}
      longitude={club.longitude}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation()
        onClick?.()
      }}
    >
      <button
        type="button"
        className={cn(
          "flex items-center justify-center rounded-full shadow-md transition-all hover:scale-110",
          sizeClasses[size],
          club.isVerified
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground",
          isSelected && "scale-125 ring-2 ring-primary ring-offset-2"
        )}
        aria-label={`View ${club.name}`}
      >
        <MapPin className={cn(iconSizeClasses[size])} />
      </button>
    </Marker>
  )
}
