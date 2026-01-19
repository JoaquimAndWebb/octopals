"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  EQUIPMENT_CONDITION_LABELS,
  EQUIPMENT_CONDITION_COLORS,
  type EquipmentCondition,
} from "@/lib/constants"

interface ConditionBadgeProps {
  condition: EquipmentCondition
  className?: string
}

export function ConditionBadge({ condition, className }: ConditionBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "border-0",
        EQUIPMENT_CONDITION_COLORS[condition],
        className
      )}
    >
      {EQUIPMENT_CONDITION_LABELS[condition]}
    </Badge>
  )
}
