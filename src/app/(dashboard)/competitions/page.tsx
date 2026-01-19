"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompetitionList } from "@/components/competitions/competition-list"
import type { Competition } from "@/components/competitions/competition-card"

// Mock data
const mockCompetitions: Competition[] = [
  {
    id: "1",
    name: "NSW State Championships",
    description: "The annual NSW State Championships featuring teams from across New South Wales.",
    organizingBody: "Underwater Hockey Australia",
    startDate: "2024-03-15",
    endDate: "2024-03-17",
    registrationDeadline: "2024-03-01",
    registrationUrl: "https://uwha.com.au/nsw-states",
    venue: "Sydney Olympic Park Aquatic Centre",
    city: "Sydney",
    country: "Australia",
    skillLevels: ["INTERMEDIATE", "ADVANCED"],
    imageUrl: null,
    websiteUrl: "https://uwha.com.au/nsw-states",
    _count: { followers: 45 },
  },
  {
    id: "2",
    name: "Australian National Championships",
    description: "Australia's premier underwater hockey competition featuring the best clubs from across the country.",
    organizingBody: "Underwater Hockey Australia",
    startDate: "2024-05-20",
    endDate: "2024-05-26",
    registrationDeadline: "2024-04-15",
    registrationUrl: "https://uwha.com.au/nationals",
    venue: "Melbourne Sports & Aquatic Centre",
    city: "Melbourne",
    country: "Australia",
    skillLevels: ["INTERMEDIATE", "ADVANCED", "ELITE"],
    imageUrl: null,
    websiteUrl: "https://uwha.com.au/nationals",
    _count: { followers: 120 },
  },
  {
    id: "3",
    name: "World Championships",
    description: "The pinnacle of underwater hockey - nations compete for world supremacy.",
    organizingBody: "CMAS",
    startDate: "2024-08-10",
    endDate: "2024-08-18",
    registrationDeadline: null,
    registrationUrl: null,
    venue: "Sheffield International Venues",
    city: "Sheffield",
    country: "United Kingdom",
    skillLevels: ["ELITE"],
    imageUrl: null,
    websiteUrl: "https://cmas.org/uwh-worlds",
    _count: { followers: 350 },
  },
]

const pastCompetitions: Competition[] = [
  {
    id: "4",
    name: "Queensland State Championships 2023",
    description: "The 2023 Queensland State Championships held in Brisbane.",
    organizingBody: "Underwater Hockey Queensland",
    startDate: "2023-10-15",
    endDate: "2023-10-17",
    registrationDeadline: "2023-10-01",
    registrationUrl: null,
    venue: "Brisbane Aquatic Centre",
    city: "Brisbane",
    country: "Australia",
    skillLevels: ["INTERMEDIATE", "ADVANCED"],
    imageUrl: null,
    websiteUrl: null,
    _count: { followers: 32 },
  },
]

export default function CompetitionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading] = useState(false)

  const filteredUpcoming = mockCompetitions.filter((comp) =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPast = pastCompetitions.filter((comp) =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Competitions</h1>
          <p className="mt-1 text-muted-foreground">
            Discover and follow underwater hockey tournaments
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCompetitions.length}</div>
            <p className="text-xs text-muted-foreground">Competitions this year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Registration Open
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockCompetitions.filter((c) => c.registrationDeadline && new Date(c.registrationDeadline) > new Date()).length}
            </div>
            <p className="text-xs text-muted-foreground">Register now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Following
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Competitions you&apos;re tracking</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search competitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            All Levels
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            State
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            National
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            International
          </Badge>
        </div>
      </div>

      {/* Competition Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({filteredUpcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({filteredPast.length})
          </TabsTrigger>
          <TabsTrigger value="following">
            Following (2)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <CompetitionList
            competitions={filteredUpcoming}
            isLoading={isLoading}
            emptyMessage="No upcoming competitions found."
          />
        </TabsContent>

        <TabsContent value="past">
          <CompetitionList
            competitions={filteredPast}
            isLoading={isLoading}
            emptyMessage="No past competitions found."
          />
        </TabsContent>

        <TabsContent value="following">
          <CompetitionList
            competitions={filteredUpcoming.slice(0, 2)}
            isLoading={isLoading}
            emptyMessage="You're not following any competitions. Browse upcoming events and click 'Follow' to track them."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
