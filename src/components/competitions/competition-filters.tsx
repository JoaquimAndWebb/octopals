"use client"

import * as React from "react"
import { RotateCcw, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SKILL_LEVELS,
  SKILL_LEVEL_LABELS,
  type SkillLevel,
} from "@/lib/constants"

// Common regions for underwater hockey competitions
const REGIONS = [
  { value: "all", label: "All Regions" },
  { value: "europe", label: "Europe" },
  { value: "north_america", label: "North America" },
  { value: "south_america", label: "South America" },
  { value: "asia_pacific", label: "Asia Pacific" },
  { value: "africa", label: "Africa" },
  { value: "oceania", label: "Oceania" },
] as const

export type RegistrationStatusFilter = "all" | "open" | "closed"

export interface CompetitionFiltersState {
  search: string
  region: string
  skillLevel: SkillLevel | null
  registrationStatus: RegistrationStatusFilter
}

interface CompetitionFiltersProps {
  filters: CompetitionFiltersState
  onChange: (filters: CompetitionFiltersState) => void
  onReset?: () => void
  className?: string
}

export function CompetitionFilters({
  filters,
  onChange,
  onReset,
  className,
}: CompetitionFiltersProps) {
  const handleSearchChange = (value: string) => {
    onChange({
      ...filters,
      search: value,
    })
  }

  const handleRegionChange = (value: string) => {
    onChange({
      ...filters,
      region: value === "all" ? "" : value,
    })
  }

  const handleSkillLevelChange = (level: SkillLevel, checked: boolean) => {
    onChange({
      ...filters,
      skillLevel: checked ? level : null,
    })
  }

  const handleRegistrationStatusChange = (status: RegistrationStatusFilter) => {
    onChange({
      ...filters,
      registrationStatus: status,
    })
  }

  const handleReset = () => {
    onChange({
      search: "",
      region: "",
      skillLevel: null,
      registrationStatus: "all",
    })
    onReset?.()
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search competitions..."
            className="pl-9"
          />
        </div>
      </div>

      <Separator />

      {/* Region */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Region</Label>
        <Select
          value={filters.region || "all"}
          onValueChange={handleRegionChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All regions" />
          </SelectTrigger>
          <SelectContent>
            {REGIONS.map((region) => (
              <SelectItem key={region.value} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Skill Level */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Skill Level</Label>
        <div className="space-y-2">
          {Object.keys(SKILL_LEVELS).map((level) => (
            <div key={level} className="flex items-center gap-2">
              <Checkbox
                id={`comp-skill-${level}`}
                checked={filters.skillLevel === level}
                onCheckedChange={(checked) =>
                  handleSkillLevelChange(level as SkillLevel, checked as boolean)
                }
              />
              <Label
                htmlFor={`comp-skill-${level}`}
                className="cursor-pointer text-sm font-normal"
              >
                {SKILL_LEVEL_LABELS[level as SkillLevel]}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Registration Status */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Registration Status</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="reg-all"
              checked={filters.registrationStatus === "all"}
              onCheckedChange={() => handleRegistrationStatusChange("all")}
            />
            <Label
              htmlFor="reg-all"
              className="cursor-pointer text-sm font-normal"
            >
              All
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="reg-open"
              checked={filters.registrationStatus === "open"}
              onCheckedChange={() => handleRegistrationStatusChange("open")}
            />
            <Label
              htmlFor="reg-open"
              className="cursor-pointer text-sm font-normal"
            >
              Open Registration
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="reg-closed"
              checked={filters.registrationStatus === "closed"}
              onCheckedChange={() => handleRegistrationStatusChange("closed")}
            />
            <Label
              htmlFor="reg-closed"
              className="cursor-pointer text-sm font-normal"
            >
              Closed Registration
            </Label>
          </div>
        </div>
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
