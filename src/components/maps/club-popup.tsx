"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Popup } from "react-map-gl/mapbox"
import { MapPin, Users, Star, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ClubMarkerData } from "./club-marker"

interface ClubPopupProps {
  club: ClubMarkerData
  onClose: () => void
}

export function ClubPopup({ club, onClose }: ClubPopupProps) {
  const [imageError, setImageError] = React.useState(false)

  return (
    <Popup
      latitude={club.latitude}
      longitude={club.longitude}
      anchor="bottom"
      offset={25}
      closeOnClick={false}
      onClose={onClose}
      className="club-popup"
    >
      <div className="w-64">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden rounded-t-md bg-muted">
          {club.imageUrl && !imageError ? (
            <Image
              src={club.imageUrl}
              alt={club.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="text-2xl font-bold text-primary/40">
                {club.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {club.isVerified && (
            <Badge
              variant="secondary"
              className="absolute right-2 top-2 flex items-center gap-1 bg-white/90 text-xs"
            >
              <CheckCircle className="h-3 w-3 text-primary" />
              Verified
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="mb-1 line-clamp-1 font-semibold">{club.name}</h3>

          <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">
              {club.city}, {club.country}
            </span>
          </div>

          <div className="mb-3 flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{club.memberCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{club.rating.toFixed(1)}</span>
            </div>
          </div>

          <Button asChild size="sm" className="w-full">
            <Link href={`/clubs/${club.slug}`}>View Club</Link>
          </Button>
        </div>
      </div>
    </Popup>
  )
}
