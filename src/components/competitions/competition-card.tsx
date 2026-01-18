"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { MapPin, Calendar, Users, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SKILL_LEVEL_LABELS, type SkillLevel } from "@/lib/constants"

export type RegistrationStatus = "open" | "closing_soon" | "closed" | "full"

export interface Competition {
  id: string
  name: string
  description: string | null
  organizingBody: string | null
  startDate: string
  endDate: string
  registrationDeadline: string | null
  registrationUrl: string | null
  venue: string | null
  city: string
  country: string
  skillLevels: SkillLevel[]
  imageUrl: string | null
  websiteUrl: string | null
  _count?: {
    followers: number
  }
}

interface CompetitionCardProps {
  competition: Competition
  className?: string
}

function getRegistrationStatus(competition: Competition): RegistrationStatus {
  if (!competition.registrationDeadline) return "open"

  const deadline = new Date(competition.registrationDeadline)
  const now = new Date()
  const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilDeadline < 0) return "closed"
  if (daysUntilDeadline <= 7) return "closing_soon"
  return "open"
}

const registrationStatusConfig: Record<
  RegistrationStatus,
  {
    label: string
    icon: React.ElementType
    color: string
  }
> = {
  open: {
    label: "Registration Open",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
  },
  closing_soon: {
    label: "Closing Soon",
    icon: AlertCircle,
    color: "bg-yellow-100 text-yellow-800",
  },
  closed: {
    label: "Registration Closed",
    icon: XCircle,
    color: "bg-red-100 text-red-800",
  },
  full: {
    label: "Full",
    icon: XCircle,
    color: "bg-gray-100 text-gray-800",
  },
}

export function CompetitionCard({ competition, className }: CompetitionCardProps) {
  const [imageError, setImageError] = React.useState(false)
  const registrationStatus = getRegistrationStatus(competition)
  const statusConfig = registrationStatusConfig[registrationStatus]
  const StatusIcon = statusConfig.icon

  const startDate = new Date(competition.startDate)
  const endDate = new Date(competition.endDate)
  const isSameDay = competition.startDate === competition.endDate

  return (
    <Link href={`/competitions/${competition.id}`}>
      <Card className={cn("overflow-hidden transition-shadow hover:shadow-md", className)}>
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative aspect-[16/9] w-full sm:aspect-square sm:w-48 shrink-0 bg-muted">
            {competition.imageUrl && !imageError ? (
              <Image
                src={competition.imageUrl}
                alt={competition.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <span className="text-4xl font-bold text-primary/40">
                  {competition.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <CardContent className="flex-1 p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="line-clamp-1 font-semibold">{competition.name}</h3>
              <Badge
                variant="secondary"
                className={cn("flex shrink-0 items-center gap-1 border-0", statusConfig.color)}
              >
                <StatusIcon className="h-3 w-3" />
                {statusConfig.label}
              </Badge>
            </div>

            {competition.organizingBody && (
              <p className="mb-2 text-sm text-muted-foreground">
                by {competition.organizingBody}
              </p>
            )}

            <div className="mb-3 space-y-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {isSameDay
                    ? format(startDate, "MMM d, yyyy")
                    : `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span className="line-clamp-1">
                  {competition.venue
                    ? `${competition.venue}, ${competition.city}, ${competition.country}`
                    : `${competition.city}, ${competition.country}`}
                </span>
              </div>

              {competition.registrationDeadline && registrationStatus !== "closed" && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Deadline: {format(new Date(competition.registrationDeadline), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {competition.skillLevels.slice(0, 3).map((level) => (
                <Badge key={level} variant="outline" className="text-xs">
                  {SKILL_LEVEL_LABELS[level]}
                </Badge>
              ))}
              {competition.skillLevels.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{competition.skillLevels.length - 3} more
                </Badge>
              )}

              {competition._count?.followers !== undefined && competition._count.followers > 0 && (
                <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{competition._count.followers} following</span>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
