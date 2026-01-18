"use client"

import * as React from "react"
import { Users, UserCheck, Star, Calendar, Package } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ClubStatsProps {
  stats: {
    memberCount: number
    activeMembers: number
    rating: number
    reviewCount: number
    sessionsPerWeek: number
    hasEquipment: boolean
    equipmentCount?: number
  }
  className?: string
}

interface StatItemProps {
  icon: React.ElementType
  label: string
  value: string | number
  subtext?: string
}

function StatItem({ icon: Icon, label, value, subtext }: StatItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold">
          {value}
          {subtext && <span className="ml-1 text-sm font-normal text-muted-foreground">{subtext}</span>}
        </p>
      </div>
    </div>
  )
}

export function ClubStats({ stats, className }: ClubStatsProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Club Statistics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <StatItem
          icon={Users}
          label="Total Members"
          value={stats.memberCount}
        />
        <StatItem
          icon={UserCheck}
          label="Active Members"
          value={stats.activeMembers}
          subtext={`(${Math.round((stats.activeMembers / stats.memberCount) * 100)}%)`}
        />
        <StatItem
          icon={Star}
          label="Average Rating"
          value={stats.rating.toFixed(1)}
          subtext={`(${stats.reviewCount} reviews)`}
        />
        <StatItem
          icon={Calendar}
          label="Sessions per Week"
          value={stats.sessionsPerWeek}
        />
        <StatItem
          icon={Package}
          label="Equipment Available"
          value={stats.hasEquipment ? "Yes" : "No"}
          subtext={stats.hasEquipment && stats.equipmentCount ? `(${stats.equipmentCount} items)` : undefined}
        />
      </CardContent>
    </Card>
  )
}
