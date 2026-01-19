"use client"

import * as React from "react"
import Image from "next/image"
import { Package, Ruler, CheckCircle, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConditionBadge } from "./condition-badge"
import {
  EQUIPMENT_TYPE_LABELS,
  EQUIPMENT_SIZE_LABELS,
  type EquipmentType,
  type EquipmentCondition,
  type EquipmentSize,
} from "@/lib/constants"

export interface Equipment {
  id: string
  name: string
  type: EquipmentType
  condition: EquipmentCondition
  size: EquipmentSize | null
  imageUrl: string | null
  isAvailable: boolean
  description?: string | null
  club?: {
    id: string
    name: string
    slug: string
  }
}

interface EquipmentCardProps {
  equipment: Equipment
  onClick?: () => void
  className?: string
}

export function EquipmentCard({ equipment, onClick, className }: EquipmentCardProps) {
  const [imageError, setImageError] = React.useState(false)

  return (
    <Card
      className={cn(
        "overflow-hidden transition-shadow hover:shadow-md",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="relative aspect-square bg-muted">
        {equipment.imageUrl && !imageError ? (
          <Image
            src={equipment.imageUrl}
            alt={equipment.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Package className="h-12 w-12 text-primary/40" />
          </div>
        )}
        {/* Availability indicator */}
        <div className="absolute right-2 top-2">
          {equipment.isAvailable ? (
            <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3" />
              Available
            </Badge>
          ) : (
            <Badge variant="secondary" className="flex items-center gap-1 bg-red-100 text-red-800">
              <XCircle className="h-3 w-3" />
              In Use
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-semibold">{equipment.name}</h3>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            {EQUIPMENT_TYPE_LABELS[equipment.type]}
          </Badge>
          <ConditionBadge condition={equipment.condition} />
        </div>

        {equipment.size && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Ruler className="h-3.5 w-3.5" />
            <span>{EQUIPMENT_SIZE_LABELS[equipment.size]}</span>
          </div>
        )}

        {equipment.club && (
          <p className="mt-2 text-xs text-muted-foreground">
            {equipment.club.name}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
