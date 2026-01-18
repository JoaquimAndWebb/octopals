"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  EQUIPMENT_TYPES,
  EQUIPMENT_TYPE_LABELS,
  EQUIPMENT_SIZES,
  EQUIPMENT_SIZE_LABELS,
  EQUIPMENT_CONDITIONS,
  EQUIPMENT_CONDITION_LABELS,
  type EquipmentType,
  type EquipmentSize,
  type EquipmentCondition,
} from "@/lib/constants"

export interface EquipmentFiltersState {
  type: EquipmentType | null
  size: EquipmentSize | null
  condition: EquipmentCondition | null
  availableOnly: boolean
}

interface EquipmentFiltersProps {
  filters: EquipmentFiltersState
  onChange: (filters: EquipmentFiltersState) => void
  onReset?: () => void
  className?: string
}

export function EquipmentFilters({
  filters,
  onChange,
  onReset,
  className,
}: EquipmentFiltersProps) {
  const handleTypeChange = (value: string) => {
    onChange({
      ...filters,
      type: value === "all" ? null : (value as EquipmentType),
    })
  }

  const handleSizeChange = (value: string) => {
    onChange({
      ...filters,
      size: value === "all" ? null : (value as EquipmentSize),
    })
  }

  const handleConditionChange = (value: string) => {
    onChange({
      ...filters,
      condition: value === "all" ? null : (value as EquipmentCondition),
    })
  }

  const handleAvailableOnlyChange = (checked: boolean) => {
    onChange({
      ...filters,
      availableOnly: checked,
    })
  }

  const handleReset = () => {
    onChange({
      type: null,
      size: null,
      condition: null,
      availableOnly: false,
    })
    onReset?.()
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Equipment Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Type</Label>
        <Select
          value={filters.type || "all"}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {Object.keys(EQUIPMENT_TYPES).map((type) => (
              <SelectItem key={type} value={type}>
                {EQUIPMENT_TYPE_LABELS[type as EquipmentType]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Size */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Size</Label>
        <Select
          value={filters.size || "all"}
          onValueChange={handleSizeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All sizes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sizes</SelectItem>
            {Object.keys(EQUIPMENT_SIZES).map((size) => (
              <SelectItem key={size} value={size}>
                {EQUIPMENT_SIZE_LABELS[size as EquipmentSize]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Condition */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Condition</Label>
        <Select
          value={filters.condition || "all"}
          onValueChange={handleConditionChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All conditions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All conditions</SelectItem>
            {Object.keys(EQUIPMENT_CONDITIONS).map((condition) => (
              <SelectItem key={condition} value={condition}>
                {EQUIPMENT_CONDITION_LABELS[condition as EquipmentCondition]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Available Only Toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="available-only" className="cursor-pointer text-sm">
          Available only
        </Label>
        <Switch
          id="available-only"
          checked={filters.availableOnly}
          onCheckedChange={handleAvailableOnlyChange}
        />
      </div>

      <Separator />

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleReset}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset Filters
      </Button>
    </div>
  )
}
