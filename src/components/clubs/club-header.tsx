"use client"

import * as React from "react"
import Image from "next/image"
import { MapPin, Users, Star, Calendar, CheckCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { JoinClubButton } from "./join-club-button"
import { FavoriteClubButton } from "./favorite-club-button"

interface ClubHeaderProps {
  club: {
    id: string
    name: string
    imageUrl?: string | null
    coverImageUrl?: string | null
    city: string
    country: string
    memberCount: number
    rating: number
    sessionsPerWeek: number
    isVerified: boolean
  }
  isMember?: boolean
  isFavorite?: boolean
  isPending?: boolean
  onJoin?: () => Promise<void>
  onLeave?: () => Promise<void>
  onToggleFavorite?: () => Promise<void>
  className?: string
}

export function ClubHeader({
  club,
  isMember = false,
  isFavorite = false,
  isPending = false,
  onJoin,
  onLeave,
  onToggleFavorite,
  className,
}: ClubHeaderProps) {
  const [coverError, setCoverError] = React.useState(false)

  return (
    <div className={cn("relative", className)}>
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-r from-primary/20 to-primary/5 md:h-64 lg:h-80">
        {club.coverImageUrl && !coverError ? (
          <Image
            src={club.coverImageUrl}
            alt={`${club.name} cover`}
            fill
            className="object-cover"
            priority
            onError={() => setCoverError(true)}
          />
        ) : null}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Club Info */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-16 flex flex-col gap-4 sm:-mt-20 sm:flex-row sm:items-end sm:gap-6">
          {/* Avatar */}
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg sm:h-32 sm:w-32">
            <AvatarImage src={club.imageUrl || undefined} alt={club.name} />
            <AvatarFallback className="text-2xl font-bold sm:text-3xl">
              {club.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Name and Info */}
          <div className="flex-1 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold sm:text-3xl">{club.name}</h1>
              {club.isVerified && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-primary" />
                  Verified
                </Badge>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {club.city}, {club.country}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{club.memberCount}</span>
                <span className="text-muted-foreground">members</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{club.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{club.sessionsPerWeek}</span>
                <span className="text-muted-foreground">sessions/week</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pb-4">
            <FavoriteClubButton
              isFavorite={isFavorite}
              onToggle={onToggleFavorite}
            />
            <JoinClubButton
              isMember={isMember}
              isPending={isPending}
              onJoin={onJoin}
              onLeave={onLeave}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
