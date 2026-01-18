"use client"

import * as React from "react"
import { Package } from "lucide-react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { EquipmentCard, type Equipment } from "./equipment-card"

interface EquipmentListProps {
  equipment: Equipment[]
  isLoading?: boolean
  emptyMessage?: string
  onItemClick?: (equipment: Equipment) => void
  className?: string
}

function EquipmentCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4">
        <Skeleton className="mb-2 h-5 w-3/4" />
        <div className="mb-3 flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

export function EquipmentList({
  equipment,
  isLoading = false,
  emptyMessage = "No equipment found",
  onItemClick,
  className,
}: EquipmentListProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
          className
        )}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <EquipmentCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (equipment.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No equipment found"
        description={emptyMessage}
        className={className}
      />
    )
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className
      )}
    >
      {equipment.map((item) => (
        <EquipmentCard
          key={item.id}
          equipment={item}
          onClick={onItemClick ? () => onItemClick(item) : undefined}
        />
      ))}
    </div>
  )
}
