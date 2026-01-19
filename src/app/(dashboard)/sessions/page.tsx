"use client"

import { useState } from "react"
import { Calendar, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SessionList } from "@/components/sessions/session-list"
import { SessionCalendar } from "@/components/sessions/session-calendar"
import { Badge } from "@/components/ui/badge"
import type { Session } from "@/components/sessions/session-card"

// Mock data
const mockSessions: Session[] = [
  {
    id: "1",
    title: "Tuesday Training",
    sessionType: "training",
    date: new Date(Date.now() + 86400000),
    endDate: new Date(Date.now() + 86400000 + 2 * 3600000),
    venue: "Sydney Aquatic Centre",
    address: "Olympic Boulevard, Sydney Olympic Park NSW 2127",
    rsvpCount: 12,
    skillLevel: "intermediate",
  },
  {
    id: "2",
    title: "Saturday Scrimmage",
    sessionType: "scrimmage",
    date: new Date(Date.now() + 4 * 86400000),
    endDate: new Date(Date.now() + 4 * 86400000 + 2 * 3600000),
    venue: "Sydney Aquatic Centre",
    address: "Olympic Boulevard, Sydney Olympic Park NSW 2127",
    rsvpCount: 18,
    skillLevel: "advanced",
  },
  {
    id: "3",
    title: "Beginner Introduction",
    sessionType: "workshop",
    date: new Date(Date.now() + 7 * 86400000),
    endDate: new Date(Date.now() + 7 * 86400000 + 2 * 3600000),
    venue: "Sydney Aquatic Centre",
    address: "Olympic Boulevard, Sydney Olympic Park NSW 2127",
    rsvpCount: 8,
    skillLevel: "beginner",
  },
]

export default function SessionsPage() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [isLoading] = useState(false)

  const handleSessionClick = (session: Session) => {
    window.location.href = `/sessions/${session.id}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Sessions</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage your training sessions
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex rounded-lg border p-1">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </Button>
            <Button
              variant={viewMode === "calendar" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 sessions</div>
            <p className="text-xs text-muted-foreground">2 confirmed, 1 pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your RSVPs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1 confirmed</div>
            <p className="text-xs text-muted-foreground">2 pending response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Session View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Upcoming Sessions</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Going
              </Badge>
              <Badge variant="outline" className="gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                Maybe
              </Badge>
              <Badge variant="outline" className="gap-1">
                <span className="h-2 w-2 rounded-full bg-gray-300" />
                No RSVP
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "list" ? (
            <SessionList
              sessions={mockSessions}
              loading={isLoading}
              onSessionClick={handleSessionClick}
              emptyMessage="No upcoming sessions. Check back later or ask your club to create one."
            />
          ) : (
            <SessionCalendar
              sessions={mockSessions}
              onSessionClick={handleSessionClick}
              onDateSelect={(date) => console.log("Selected date:", date)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
