"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Users, Star, CheckCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SKILL_LEVEL_LABELS, type SkillLevel } from "@/lib/constants"

export interface Club {
  id: string
  name: string
  slug: string
  imageUrl?: string | null
  city: string
  country: string
  memberCount: number
  rating: number
  isVerified: boolean
  skillLevels: SkillLevel[]
  distance?: number
}

interface ClubCardProps {
  club: Club
  className?: string
}

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="h-3.5 w-3.5 text-muted-foreground" />
      ))}
      <span className="ml-1 text-sm text-muted-foreground">({rating.toFixed(1)})</span>
    </div>
  )
}

export function ClubCard({ club, className }: ClubCardProps) {
  const [imageError, setImageError] = React.useState(false)

  return (
    <Link href={`/clubs/${club.slug}`}>
      <Card className={cn("overflow-hidden transition-shadow hover:shadow-md", className)}>
        <div className="relative aspect-[16/9] bg-muted">
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
              <span className="text-4xl font-bold text-primary/40">
                {club.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {club.isVerified && (
            <div className="absolute right-2 top-2">
              <Badge variant="secondary" className="flex items-center gap-1 bg-white/90">
                <CheckCircle className="h-3 w-3 text-primary" />
                Verified
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-semibold">{club.name}</h3>
          </div>

          <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">
              {club.city}, {club.country}
              {club.distance !== undefined && ` (${club.distance.toFixed(1)} km)`}
            </span>
          </div>

          <div className="mb-3 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>{club.memberCount} members</span>
            </div>
            <RatingStars rating={club.rating} />
          </div>

          {club.skillLevels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {club.skillLevels.map((level) => (
                <Badge key={level} variant="outline" className="text-xs">
                  {SKILL_LEVEL_LABELS[level]}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
